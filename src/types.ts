import { IdlTypes, Program } from "@coral-xyz/anchor";
import { MerkleDistributor as LiquidityDistributor } from "./idl/idl";

export type LiquidityDistributorProgram = Program<LiquidityDistributor>;

export type ClaimStatus = IdlTypes<LiquidityDistributor>["claimStatus"];

export type Distributor = IdlTypes<LiquidityDistributor>["merkleDistributor"];

export interface UserResponse {
  merkle_tree: string;
  amount: number;
  proof: number[][];
}
