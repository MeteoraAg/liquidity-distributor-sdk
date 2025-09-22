import { PublicKey } from "@solana/web3.js";
import {
  DAMM_V2_PROGRAM_ID,
  LIQUIDITY_DISTRIBUTOR_PROGRAM_ID,
} from "../constants";

export function deriveClaimStatusAddress(
  claimant: PublicKey,
  merkleTree: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("ClaimStatus"), claimant.toBuffer(), merkleTree.toBuffer()],
    LIQUIDITY_DISTRIBUTOR_PROGRAM_ID
  )[0];
}

export function deriveDammv2EventAuthorityAddress() {
  const [pubkey] = PublicKey.findProgramAddressSync(
    [Buffer.from("__event_authority")],
    DAMM_V2_PROGRAM_ID
  );
  return pubkey;
}
