/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/liquidity_distributor.json`.
 */
export type LiquidityDistributor = {
  address: "pDisRpxvnFw4osSqDPqMJ62tLsVQGsHL4tMX23ArYrL";
  metadata: {
    name: "liquidityDistributor";
    version: "0.1.0";
    spec: "0.1.0";
    description: "A Solana program for distributing tokens according to a Merkle root.";
  };
  instructions: [
    {
      name: "clawback";
      discriminator: [111, 92, 142, 79, 33, 234, 82, 27];
      accounts: [
        {
          name: "distributor";
          docs: ["The [MerkleDistributor]."];
          writable: true;
        },
        {
          name: "positionNftAccount";
          relations: ["distributor"];
        },
        {
          name: "token2022Program";
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        }
      ];
      args: [];
    },
    {
      name: "closeClaimStatus";
      docs: ["only available in test phase"];
      discriminator: [163, 214, 191, 165, 245, 188, 17, 185];
      accounts: [
        {
          name: "claimStatus";
          writable: true;
        },
        {
          name: "claimant";
          writable: true;
          relations: ["claimStatus"];
        },
        {
          name: "admin";
          signer: true;
          relations: ["claimStatus"];
        }
      ];
      args: [];
    },
    {
      name: "closeDistributor";
      docs: ["only available in test phase"];
      discriminator: [202, 56, 180, 143, 46, 104, 106, 112];
      accounts: [
        {
          name: "distributor";
          docs: ["[MerkleDistributor]."];
          writable: true;
        },
        {
          name: "admin";
          docs: [
            "Admin wallet, responsible for creating the distributor and paying for the transaction.",
            "Also has the authority to set the clawback receiver and change itself."
          ];
          signer: true;
          relations: ["distributor"];
        },
        {
          name: "rentReceiver";
          writable: true;
        },
        {
          name: "positionNftAccount";
          relations: ["distributor"];
        },
        {
          name: "token2022Program";
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        }
      ];
      args: [];
    },
    {
      name: "newClaim";
      discriminator: [78, 177, 98, 123, 210, 21, 187, 83];
      accounts: [
        {
          name: "distributor";
          docs: ["The [MerkleDistributor]."];
          writable: true;
        },
        {
          name: "claimStatus";
          docs: ["Claim status PDA"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [67, 108, 97, 105, 109, 83, 116, 97, 116, 117, 115];
              },
              {
                kind: "account";
                path: "claimant";
              },
              {
                kind: "account";
                path: "distributor";
              }
            ];
          };
        },
        {
          name: "claimant";
          docs: ["Who is claiming the tokens."];
          signer: true;
        },
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          docs: ["The [System] program."];
          address: "11111111111111111111111111111111";
        },
        {
          name: "ammProgram";
          address: "cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG";
        },
        {
          name: "pool";
          relations: ["distributor"];
        },
        {
          name: "position";
          writable: true;
          relations: ["distributor"];
        },
        {
          name: "positionNftAccount";
          relations: ["distributor"];
        },
        {
          name: "secondPosition";
          writable: true;
        },
        {
          name: "secondPositionNftAccount";
        },
        {
          name: "dammEventAuthority";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "proof";
          type: {
            vec: {
              array: ["u8", 32];
            };
          };
        }
      ];
    },
    {
      name: "newDistributor";
      discriminator: [32, 139, 112, 171, 0, 2, 225, 155];
      accounts: [
        {
          name: "distributor";
          docs: ["[MerkleDistributor]."];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  77,
                  101,
                  114,
                  107,
                  108,
                  101,
                  68,
                  105,
                  115,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  111,
                  114
                ];
              },
              {
                kind: "account";
                path: "base";
              },
              {
                kind: "arg";
                path: "version";
              }
            ];
          };
        },
        {
          name: "base";
          docs: ["Base key of the distributor."];
          signer: true;
        },
        {
          name: "clawbackReceiver";
        },
        {
          name: "admin";
          docs: [
            "Admin wallet, responsible for creating the distributor and paying for the transaction.",
            "Also has the authority to set the clawback receiver and change itself."
          ];
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          docs: ["The [System] program."];
          address: "11111111111111111111111111111111";
        },
        {
          name: "pool";
          relations: ["position"];
        },
        {
          name: "position";
          docs: ["The first position"];
          writable: true;
        },
        {
          name: "positionNftAccount";
          docs: ["The token account for position nft"];
        }
      ];
      args: [
        {
          name: "version";
          type: "u64";
        },
        {
          name: "root";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "totalClaim";
          type: "u64";
        },
        {
          name: "maxNumNodes";
          type: "u64";
        },
        {
          name: "clawbackStartTs";
          type: "i64";
        },
        {
          name: "activationPoint";
          type: "u64";
        },
        {
          name: "activationType";
          type: "u8";
        },
        {
          name: "closable";
          type: "bool";
        }
      ];
    },
    {
      name: "setActivationPoint";
      discriminator: [91, 249, 15, 165, 26, 129, 254, 125];
      accounts: [
        {
          name: "distributor";
          docs: ["[MerkleDistributor]."];
          writable: true;
        },
        {
          name: "admin";
          docs: ["Payer to create the distributor."];
          writable: true;
          signer: true;
          relations: ["distributor"];
        }
      ];
      args: [
        {
          name: "activationPoint";
          type: "u64";
        }
      ];
    },
    {
      name: "setAdmin";
      discriminator: [251, 163, 0, 52, 91, 194, 187, 92];
      accounts: [
        {
          name: "distributor";
          docs: ["The [MerkleDistributor]."];
          writable: true;
        },
        {
          name: "admin";
          docs: ["Admin signer"];
          writable: true;
          signer: true;
        },
        {
          name: "newAdmin";
          docs: ["New admin account"];
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "setClawbackReceiver";
      discriminator: [153, 217, 34, 20, 19, 29, 229, 75];
      accounts: [
        {
          name: "distributor";
          docs: ["The [MerkleDistributor]."];
          writable: true;
        },
        {
          name: "newClawbackAccount";
        },
        {
          name: "admin";
          docs: ["Admin signer"];
          writable: true;
          signer: true;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "claimStatus";
      discriminator: [22, 183, 249, 157, 247, 95, 150, 96];
    },
    {
      name: "merkleDistributor";
      discriminator: [77, 119, 139, 70, 84, 247, 12, 26];
    },
    {
      name: "pool";
      discriminator: [241, 154, 109, 4, 17, 177, 109, 188];
    },
    {
      name: "position";
      discriminator: [170, 188, 143, 228, 122, 64, 247, 208];
    }
  ];
  events: [
    {
      name: "claimedEvent";
      discriminator: [144, 172, 209, 86, 144, 87, 84, 115];
    },
    {
      name: "newClaimEvent";
      discriminator: [244, 3, 231, 151, 60, 101, 55, 55];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidPositionLiquidity";
      msg: "Invalid position liquidity";
    },
    {
      code: 6001;
      name: "invalidActivationParameters";
      msg: "Invalid activation parameters";
    },
    {
      code: 6002;
      name: "arithmeticError";
      msg: "Arithmetic Error (overflow/underflow)";
    },
    {
      code: 6003;
      name: "invalidPoolAmount";
      msg: "Invalid pool amount";
    },
    {
      code: 6004;
      name: "invalidProof";
      msg: "Invalid Merkle proof";
    },
    {
      code: 6005;
      name: "exceededMaxClaim";
      msg: "Exceeded maximum claim amount";
    },
    {
      code: 6006;
      name: "maxNodesExceeded";
      msg: "Exceeded maximum node count";
    },
    {
      code: 6007;
      name: "unauthorized";
      msg: "Account is not authorized to execute this instruction";
    },
    {
      code: 6008;
      name: "clawbackBeforeStart";
      msg: "Attempted clawback before start";
    },
    {
      code: 6009;
      name: "clawbackAlreadyClaimed";
      msg: "Clawback already claimed";
    },
    {
      code: 6010;
      name: "insufficientClawbackDelay";
      msg: "Clawback start must be at least one day after vesting end";
    },
    {
      code: 6011;
      name: "sameClawbackReceiver";
      msg: "New and old Clawback receivers are identical";
    },
    {
      code: 6012;
      name: "sameAdmin";
      msg: "New and old admin are identical";
    },
    {
      code: 6013;
      name: "claimExpired";
      msg: "Claim window expired";
    },
    {
      code: 6014;
      name: "claimingIsNotStarted";
      msg: "Claiming is not started";
    },
    {
      code: 6015;
      name: "cannotCloseDistributor";
      msg: "Cannot close distributor";
    },
    {
      code: 6016;
      name: "cannotCloseClaimStatus";
      msg: "Cannot close claim status";
    },
    {
      code: 6017;
      name: "invalidActivationType";
      msg: "Invalid activation type";
    },
    {
      code: 6018;
      name: "invalidActivationPoint";
      msg: "Invalid activation point";
    }
  ];
  types: [
    {
      name: "baseFeeStruct";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "cliffFeeNumerator";
            type: "u64";
          },
          {
            name: "feeSchedulerMode";
            type: "u8";
          },
          {
            name: "padding0";
            type: {
              array: ["u8", 5];
            };
          },
          {
            name: "numberOfPeriod";
            type: "u16";
          },
          {
            name: "periodFrequency";
            type: "u64";
          },
          {
            name: "reductionFactor";
            type: "u64";
          },
          {
            name: "padding1";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "claimStatus";
      docs: ["Holds whether or not a claimant has claimed tokens."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "claimant";
            docs: ["Authority that claimed the tokens."];
            type: "pubkey";
          },
          {
            name: "amount";
            docs: ["amount"];
            type: "u64";
          },
          {
            name: "closable";
            docs: [
              "indicate that whether admin can close this account, for testing purpose"
            ];
            type: "bool";
          },
          {
            name: "admin";
            docs: ["admin of merkle tree, store for for testing purpose"];
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "claimedEvent";
      docs: ["Emitted when tokens are claimed."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "claimant";
            docs: ["User that claimed."];
            type: "pubkey";
          },
          {
            name: "amount";
            docs: ["Amount of tokens to distribute."];
            type: "u64";
          }
        ];
      };
    },
    {
      name: "dynamicFeeStruct";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "initialized";
            type: "u8";
          },
          {
            name: "padding";
            type: {
              array: ["u8", 7];
            };
          },
          {
            name: "maxVolatilityAccumulator";
            type: "u32";
          },
          {
            name: "variableFeeControl";
            type: "u32";
          },
          {
            name: "binStep";
            type: "u16";
          },
          {
            name: "filterPeriod";
            type: "u16";
          },
          {
            name: "decayPeriod";
            type: "u16";
          },
          {
            name: "reductionFactor";
            type: "u16";
          },
          {
            name: "lastUpdateTimestamp";
            type: "u64";
          },
          {
            name: "binStepU128";
            type: "u128";
          },
          {
            name: "sqrtPriceReference";
            type: "u128";
          },
          {
            name: "volatilityAccumulator";
            type: "u128";
          },
          {
            name: "volatilityReference";
            type: "u128";
          }
        ];
      };
    },
    {
      name: "merkleDistributor";
      docs: ["State for the account which distributes tokens."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            docs: ["Bump seed."];
            type: "u8";
          },
          {
            name: "version";
            docs: ["Version of the airdrop"];
            type: "u64";
          },
          {
            name: "root";
            docs: ["The 256-bit merkle root."];
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "base";
            docs: ["base key of distributor."];
            type: "pubkey";
          },
          {
            name: "pool";
            docs: ["Damm v2 pool"];
            type: "pubkey";
          },
          {
            name: "position";
            docs: ["Damm v2 position"];
            type: "pubkey";
          },
          {
            name: "positionNftAccount";
            docs: ["Damm v2 position_nft_account"];
            type: "pubkey";
          },
          {
            name: "unlockedLiquidity";
            docs: ["position unlocked liquidity"];
            type: "u128";
          },
          {
            name: "maxTotalClaim";
            docs: [
              "Maximum number of tokens that can ever be claimed from this [MerkleDistributor]."
            ];
            type: "u64";
          },
          {
            name: "maxNumNodes";
            docs: ["Maximum number of nodes in [MerkleDistributor]."];
            type: "u64";
          },
          {
            name: "totalAmountClaimed";
            docs: ["Total amount of tokens that have been claimed."];
            type: "u64";
          },
          {
            name: "numNodesClaimed";
            docs: ["Number of nodes that have been claimed."];
            type: "u64";
          },
          {
            name: "clawbackStartTs";
            docs: ["Clawback start (Unix Timestamp)"];
            type: "i64";
          },
          {
            name: "clawbackReceiver";
            docs: ["Clawback receiver"];
            type: "pubkey";
          },
          {
            name: "admin";
            docs: ["Admin wallet"];
            type: "pubkey";
          },
          {
            name: "clawedBack";
            docs: ["Whether or not the distributor has been clawed back"];
            type: "bool";
          },
          {
            name: "activationPoint";
            docs: ["this merkle tree is activated from this slot or timestamp"];
            type: "u64";
          },
          {
            name: "closable";
            docs: [
              "indicate that whether admin can close this pool, for testing purpose"
            ];
            type: "bool";
          },
          {
            name: "activationType";
            docs: ["activation type, 0 means slot, 1 means timestamp"];
            type: "u8";
          },
          {
            name: "buffer";
            docs: ["Buffer 0"];
            type: {
              array: ["u8", 32];
            };
          }
        ];
      };
    },
    {
      name: "newClaimEvent";
      docs: ["Emitted when a new claim is created."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "claimant";
            docs: ["User that claimed."];
            type: "pubkey";
          },
          {
            name: "timestamp";
            docs: ["Timestamp."];
            type: "i64";
          }
        ];
      };
    },
    {
      name: "pool";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "poolFees";
            type: {
              defined: {
                name: "poolFeesStruct";
              };
            };
          },
          {
            name: "tokenAMint";
            type: "pubkey";
          },
          {
            name: "tokenBMint";
            type: "pubkey";
          },
          {
            name: "tokenAVault";
            type: "pubkey";
          },
          {
            name: "tokenBVault";
            type: "pubkey";
          },
          {
            name: "whitelistedVault";
            type: "pubkey";
          },
          {
            name: "partner";
            type: "pubkey";
          },
          {
            name: "liquidity";
            type: "u128";
          },
          {
            name: "padding";
            type: "u128";
          },
          {
            name: "protocolAFee";
            type: "u64";
          },
          {
            name: "protocolBFee";
            type: "u64";
          },
          {
            name: "partnerAFee";
            type: "u64";
          },
          {
            name: "partnerBFee";
            type: "u64";
          },
          {
            name: "sqrtMinPrice";
            type: "u128";
          },
          {
            name: "sqrtMaxPrice";
            type: "u128";
          },
          {
            name: "sqrtPrice";
            type: "u128";
          },
          {
            name: "activationPoint";
            type: "u64";
          },
          {
            name: "activationType";
            type: "u8";
          },
          {
            name: "poolStatus";
            type: "u8";
          },
          {
            name: "tokenAFlag";
            type: "u8";
          },
          {
            name: "tokenBFlag";
            type: "u8";
          },
          {
            name: "collectFeeMode";
            type: "u8";
          },
          {
            name: "poolType";
            type: "u8";
          },
          {
            name: "padding0";
            type: {
              array: ["u8", 2];
            };
          },
          {
            name: "feeAPerLiquidity";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "feeBPerLiquidity";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "permanentLockLiquidity";
            type: "u128";
          },
          {
            name: "metrics";
            type: {
              defined: {
                name: "poolMetrics";
              };
            };
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "padding1";
            type: {
              array: ["u64", 6];
            };
          },
          {
            name: "rewardInfos";
            type: {
              array: [
                {
                  defined: {
                    name: "rewardInfo";
                  };
                },
                2
              ];
            };
          }
        ];
      };
    },
    {
      name: "poolFeesStruct";
      docs: [
        "Information regarding fee charges",
        "trading_fee = amount * trade_fee_numerator / denominator",
        "protocol_fee = trading_fee * protocol_fee_percentage / 100",
        "referral_fee = protocol_fee * referral_percentage / 100",
        "partner_fee = (protocol_fee - referral_fee) * partner_fee_percentage / denominator"
      ];
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "baseFee";
            type: {
              defined: {
                name: "baseFeeStruct";
              };
            };
          },
          {
            name: "protocolFeePercent";
            type: "u8";
          },
          {
            name: "partnerFeePercent";
            type: "u8";
          },
          {
            name: "referralFeePercent";
            type: "u8";
          },
          {
            name: "padding0";
            type: {
              array: ["u8", 5];
            };
          },
          {
            name: "dynamicFee";
            type: {
              defined: {
                name: "dynamicFeeStruct";
              };
            };
          },
          {
            name: "padding1";
            type: {
              array: ["u64", 2];
            };
          }
        ];
      };
    },
    {
      name: "poolMetrics";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "totalLpAFee";
            type: "u128";
          },
          {
            name: "totalLpBFee";
            type: "u128";
          },
          {
            name: "totalProtocolAFee";
            type: "u64";
          },
          {
            name: "totalProtocolBFee";
            type: "u64";
          },
          {
            name: "totalPartnerAFee";
            type: "u64";
          },
          {
            name: "totalPartnerBFee";
            type: "u64";
          },
          {
            name: "totalPosition";
            type: "u64";
          },
          {
            name: "padding";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "position";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "pool";
            type: "pubkey";
          },
          {
            name: "nftMint";
            type: "pubkey";
          },
          {
            name: "feeAPerTokenCheckpoint";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "feeBPerTokenCheckpoint";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "feeAPending";
            type: "u64";
          },
          {
            name: "feeBPending";
            type: "u64";
          },
          {
            name: "unlockedLiquidity";
            type: "u128";
          },
          {
            name: "vestedLiquidity";
            type: "u128";
          },
          {
            name: "permanentLockedLiquidity";
            type: "u128";
          },
          {
            name: "metrics";
            type: {
              defined: {
                name: "positionMetrics";
              };
            };
          },
          {
            name: "rewardInfos";
            type: {
              array: [
                {
                  defined: {
                    name: "userRewardInfo";
                  };
                },
                2
              ];
            };
          },
          {
            name: "padding";
            type: {
              array: ["u128", 6];
            };
          }
        ];
      };
    },
    {
      name: "positionMetrics";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "totalClaimedAFee";
            type: "u64";
          },
          {
            name: "totalClaimedBFee";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "rewardInfo";
      docs: ["Stores the state relevant for tracking liquidity mining rewards"];
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "initialized";
            type: "u8";
          },
          {
            name: "rewardTokenFlag";
            type: "u8";
          },
          {
            name: "padding0";
            type: {
              array: ["u8", 6];
            };
          },
          {
            name: "padding1";
            type: {
              array: ["u8", 8];
            };
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "vault";
            type: "pubkey";
          },
          {
            name: "funder";
            type: "pubkey";
          },
          {
            name: "rewardDuration";
            type: "u64";
          },
          {
            name: "rewardDurationEnd";
            type: "u64";
          },
          {
            name: "rewardRate";
            type: "u128";
          },
          {
            name: "rewardPerTokenStored";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "lastUpdateTime";
            type: "u64";
          },
          {
            name: "cumulativeSecondsWithEmptyLiquidityReward";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "userRewardInfo";
      serialization: "bytemuck";
      repr: {
        kind: "c";
      };
      type: {
        kind: "struct";
        fields: [
          {
            name: "rewardPerTokenCheckpoint";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "rewardPendings";
            type: "u64";
          },
          {
            name: "totalClaimedRewards";
            type: "u64";
          }
        ];
      };
    }
  ];
};
