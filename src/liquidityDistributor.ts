import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  ClaimStatus,
  Distributor,
  LiquidityDistributorProgram,
  UserResponse,
} from "./types";
import { createLiquidityDistributorProgram } from "./helpers/program";
import {
  deriveClaimStatusAddress,
  deriveDammv2EventAuthorityAddress,
} from "./helpers/pda";
import BN from "bn.js";
import { DAMM_V2_PROGRAM_ID } from "./constants";
import { derivePositionNftAccount } from "@meteora-ag/cp-amm-sdk";

export class LiquidityDistributorClient {
  program: LiquidityDistributorProgram;
  private mint: PublicKey;
  private claimProofEndpoint: string;
  private commitment: Commitment;
  private connection: Connection;

  constructor(
    mint: PublicKey,
    claimProofEndpoint: string,
    connection: Connection,
    commitment: Commitment
  ) {
    this.program = createLiquidityDistributorProgram(connection, commitment);
    this.mint = mint;
    this.claimProofEndpoint = claimProofEndpoint;
    this.connection = connection;
    this.commitment = commitment;
  }
  async getUser(claimant: PublicKey): Promise<UserResponse | null> {
    try {
      const res = await fetch(
        `${
          this.claimProofEndpoint
        }/${this.mint.toBase58()}/${claimant.toBase58()}`
      );

      if (!res.ok) {
        return null;
      }

      const user = await res.json();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getClaimStatus(claimant: PublicKey): Promise<ClaimStatus | null> {
    const user = await this.getUser(claimant);
    if (!user) {
      throw new Error("User not found");
    }

    const claimStatusAddress = deriveClaimStatusAddress(
      claimant,
      new PublicKey(user.merkle_tree)
    );

    const claimStatusAccountData =
      await this.program.account.claimStatus.fetchNullable(claimStatusAddress);
    if (!claimStatusAccountData) {
      throw new Error("Claim status not found");
    }

    return claimStatusAccountData;
  }

  async getDistributor(merkleTree: PublicKey): Promise<Distributor | null> {
    const distributor =
      await this.program.account.merkleDistributor.fetchNullable(merkleTree);
    if (!distributor) {
      throw new Error("Distributor not found");
    }
    return distributor;
  }

  async claimPositionNft(
    claimant: PublicKey,
    payer: PublicKey
  ): Promise<Transaction> {
    const user = await this.getUser(claimant);
    if (!user) {
      throw new Error("User not found");
    }

    const { proof, merkle_tree } = user;
    const distributorAddress = new PublicKey(merkle_tree);

    const distributorAccountData = await this.getDistributor(
      distributorAddress
    );

    const claimStatusAddress = deriveClaimStatusAddress(
      claimant,
      distributorAddress
    );

    const secondPosition = Keypair.generate();
    const secondPositionNftAccount = derivePositionNftAccount(
      secondPosition.publicKey
    );

    return this.program.methods
      .newClaim(new BN(user.amount), proof)
      .accountsPartial({
        distributor: distributorAddress,
        claimStatus: claimStatusAddress,
        claimant,
        payer,
        ammProgram: DAMM_V2_PROGRAM_ID,
        pool: distributorAccountData.pool,
        position: distributorAccountData.position,
        positionNftAccount: distributorAccountData.positionNftAccount,
        secondPosition: secondPosition.publicKey,
        secondPositionNftAccount: secondPositionNftAccount,
        dammEventAuthority: deriveDammv2EventAuthorityAddress(),
      })
      .transaction();
  }
}
