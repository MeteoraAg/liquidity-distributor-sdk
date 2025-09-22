import { Commitment, Connection } from "@solana/web3.js";
import { LiquidityDistributorProgram } from "../types";
import { LiquidityDistributor } from "../idl/idl";
import LiquidityDistributorIDL from "../idl/idl.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";

export function createLiquidityDistributorProgram(
  connection: Connection,
  commitment: Commitment = "confirmed"
): LiquidityDistributorProgram {
  const provider = new AnchorProvider(connection, null as Wallet, {
    commitment,
  });
  const program = new Program<LiquidityDistributor>(
    LiquidityDistributorIDL,
    provider
  );

  return program;
}
