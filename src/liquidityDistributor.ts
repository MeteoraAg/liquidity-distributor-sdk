import { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { LiquidityDistributorProgram } from "./types";
import { createLiquidityDistributorProgram } from "./helpers/program";

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
  async claimPositionNft() {}
  async getClaimStatus() {}
  async getUser() {}
}
