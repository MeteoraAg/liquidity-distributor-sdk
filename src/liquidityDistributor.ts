import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ClaimStatus,
  Distributor,
  LiquidityDistributorProgram,
  UserResponse,
} from "./types";
import {
  createLiquidityDistributorProgram,
  deriveClaimStatusAddress,
  deriveDammv2EventAuthorityAddress,
} from "./helpers";
import BN from "bn.js";
import { DAMM_V2_PROGRAM_ID } from "./constants";
import {
  derivePositionAddress,
  derivePositionNftAccount,
} from "@meteora-ag/cp-amm-sdk";
import { CpAmm } from "@meteora-ag/cp-amm-sdk";

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

  private async createPosition(
    owner: PublicKey,
    payer: PublicKey,
    pool: PublicKey,
    positionNft: PublicKey
  ): Promise<TransactionInstruction[]> {
    const cpAmm = new CpAmm(this.connection);

    const createPositionTx = await cpAmm.createPosition({
      owner,
      payer,
      pool,
      positionNft,
    });

    return createPositionTx.instructions;
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
  ): Promise<{
    newClaimTx: Transaction;
    secondPositionNftMintKeypair: Keypair;
  }> {
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

    const secondPositionKeypair = Keypair.generate();
    const secondPositionNftAccount = derivePositionNftAccount(
      secondPositionKeypair.publicKey
    );
    const secondPosition = derivePositionAddress(
      secondPositionKeypair.publicKey
    );
    const dammV2EventAuthority = deriveDammv2EventAuthorityAddress();

    const preInstructions: TransactionInstruction[] = [];

    const createPositionIxs = await this.createPosition(
      claimant,
      claimant,
      distributorAccountData.pool,
      secondPositionKeypair.publicKey
    );

    preInstructions.push(...createPositionIxs);

    const newClaimTx = await this.program.methods
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
        secondPosition: secondPosition,
        secondPositionNftAccount: secondPositionNftAccount,
        dammEventAuthority: dammV2EventAuthority,
      })
      .preInstructions(preInstructions)
      .transaction();

    return {
      newClaimTx,
      secondPositionNftMintKeypair: secondPositionKeypair,
    };
  }
}
