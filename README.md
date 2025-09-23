# Meteora Liquidity Distributor SDK

A Typescript SDK for interacting with the Liquidity Distributor Program on Meteora.

## Overview

This SDK provides a set of tools and methods to interact with the Meteora Liquidity Distributor Program. It enables developers to distribute liquidity in the form of NFTs to their users.

## Installation

```bash
npm install @meteora-ag/liquidity-distributor-sdk
# or
pnpm install @meteora-ag/liquidity-distributor-sdk
# or
yarn add @meteora-ag/liquidity-distributor-sdk
```

## Initialization

```typescript
import { Connection } from "@solana/web3.js";
import { LiquidityDistributorClient } from "@meteora-ag/liquidity-distributor-sdk";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const tokenMint = new PublicKey("YOUR_TOKEN_MINT");
const claimProofEndpoint = "YOUR_CLAIM_PROOF_ENDPOINT";
const client = new LiquidityDistributorClient(
  tokenMint,
  claimProofEndpoint,
  connection,
  "confirmed"
);
```

## Usage

Refer to the [docs](./docs.md) for how to use the functions.

## Test

```bash
pnpm install
pnpm test
```

## Program Address

- Mainnet-beta: `pDisRpxvnFw4osSqDPqMJ62tLsVQGsHL4tMX23ArYrL`
- Devnet: `pDisRpxvnFw4osSqDPqMJ62tLsVQGsHL4tMX23ArYrL`
