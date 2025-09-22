# Liquidity Distributor SDK: Function Documentation

## Table of Contents

- [Main Functions](#main-functions)

  - [claimPositionNft](#claimPositionNft)

- [State Functions](#state-functions)

  - [getDistributor](#getDistributor)
  - [getClaimStatus](#getClaimStatus)
  - [getUser](#getUser)

---

## Main Functions

### claimPositionNft

Claim a position NFT from the merkle tree

**Function**

```typescript
async claimPositionNft(claimant: PublicKey, payer: PublicKey): Promise<{
  newClaimTx: Transaction;
  secondPositionNftMintKeypair: Keypair;
}>
```

**Parameters**

```typescript
{
  claimant: PublicKey; // The claimant's public key
  payer: PublicKey; // The payer's public key
}
```

**Returns**

- A transaction that can be signed and sent to the network with the claimant and second position NFT mint keypair to sign the transaction.

**Example**

```typescript
const transaction = await client.claimPositionNft({
  claimant: new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz"),
  payer: new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz"),
});

const { newClaimTx, secondPositionNftMintKeypair } = transaction;

const signature = await sendAndConfirmTransaction(connection, newClaimTx, [
  claimant,
  secondPositionNftMintKeypair,
]);
```

**Notes**

- When signing the transaction, the secondPositionNftMintKeypair must sign the transaction.
- If the `distributorAccountData` is not provided, it will be fetched within the `claimPositionNft` function.

---

## State Functions

### getDistributor

Get the distributor from the merkle tree

**Function**

```typescript
async getDistributor(merkleTree: PublicKey): Promise<Distributor>
```

**Parameters**

```typescript
{
  merkleTree: PublicKey; // The merkle tree's public key
}
```

**Returns**

- The distributor from the merkle tree

**Example**

```typescript
const distributor = await client.getDistributor(
  new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz")
);
```

---

### getClaimStatus

Get the claim status from the claim proof endpoint

**Function**

```typescript
async getClaimStatus(claimant: PublicKey): Promise<ClaimStatus>
```

**Parameters**

```typescript
{
  claimant: PublicKey; // The claimant's public key
}
```

**Returns**

- The claim status from the claim proof endpoint

**Example**

```typescript
const claimStatusAddress = deriveClaimStatusAddress(
  new PublicKey("claimant"),
  new PublicKey("merkleTree")
);

const claimStatus = await client.getClaimStatus(
  new PublicKey("claimStatusAddress")
);
```

---

### getUser

Get the user's information from the claim proof endpoint

**Function**

```typescript
async getUser(claimant: PublicKey): Promise<UserResponse>
```

**Returns**

- The user's information from the claim proof endpoint

**Example**

```typescript
const user = await client.getUser(
  new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz")
);
```

---
