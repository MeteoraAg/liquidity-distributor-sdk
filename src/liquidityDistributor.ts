import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  ClaimPositionNftParam,
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

  /**
   * Create a position in the DAMM v2 pool using the CP AMM SDK
   * @param owner - The owner's public key
   * @param payer - The payer's public key
   * @param pool - The pool's public key
   * @param positionNft - The position NFT's public key
   * @returns The create position transaction instructions
   */
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

  /**
   * Get the user's information from the claim proof endpoint
   * @param claimant - The claimant's public key
   * @returns The user's information from kv proof endpoint
   */
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

  /**
   * Get the claim status from the claim proof endpoint
   * @param claimant - The claimant's public key
   * @returns The claim status account data from the claim proof endpoint
   */
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
      return null;
    }

    return claimStatusAccountData;
  }

  /**
   * Get the merkle tree distributor address from the merkle tree
   * @param merkleTree - The merkle tree's public key
   * @returns The merkle tree distributor address
   */
  async getDistributor(merkleTree: PublicKey): Promise<Distributor | null> {
    const distributor =
      await this.program.account.merkleDistributor.fetchNullable(merkleTree);

    if (!distributor) {
      return null;
    }

    return distributor;
  }

  /**
   * Claim a position NFT from the merkle tree
   * @param claimant - The claimant's public key
   * @param payer - The payer's public key
   * @returns The new claim transaction and the second position NFT mint keypair to sign the transaction
   */
  async claimPositionNft(params: ClaimPositionNftParam): Promise<{
    newClaimTx: Transaction;
    secondPositionNftMintKeypair: Keypair;
  }> {
    const { claimant, payer } = params;

    const user = await this.getUser(claimant);
    if (!user) {
      throw new Error("User not found");
    }

    const { proof, merkle_tree } = user;
    const distributorAddress = new PublicKey(merkle_tree);

    let { distributorAccountData } = params;
    if (!distributorAccountData) {
      distributorAccountData = await this.getDistributor(distributorAddress);
      if (!distributorAccountData) {
        throw new Error("Distributor not found");
      }
    }

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
