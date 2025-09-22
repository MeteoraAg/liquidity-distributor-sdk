import { IdlTypes, Program } from "@coral-xyz/anchor";
import { LiquidityDistributor } from "./idl/idl";
import { PublicKey } from "@solana/web3.js";

export type LiquidityDistributorProgram = Program<LiquidityDistributor>;

export type ClaimStatus = IdlTypes<LiquidityDistributor>["claimStatus"];
export type Distributor = IdlTypes<LiquidityDistributor>["merkleDistributor"];

export interface UserResponse {
  merkle_tree: string;
  amount: number;
  proof: number[][];
}

export type ClaimPositionNftParam = {
  claimant: PublicKey;
  payer: PublicKey;
  distributorAccountData?: Distributor;
};
