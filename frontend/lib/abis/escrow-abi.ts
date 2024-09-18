export const EscrowAbi = [
  {
    inputs: [
      { internalType: "address", name: "_addressProvider", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "AlreadyActiveEscrowTx",
    type: "error"
  },
  { inputs: [], name: "EnforcedPause", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "ErrorWithdrawFromPool",
    type: "error"
  },
  { inputs: [], name: "ExpectedPause", type: "error" },
  {
    inputs: [
      {
        internalType: "enum EscrowVariables.EscrowStatus",
        name: "",
        type: "uint8"
      }
    ],
    name: "IncorrectEscrowTxStatus",
    type: "error"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "InsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "OnlyEscrowTxInitiatorAllowed", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "TokenNotSupported",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "UnlockTimeNotReached",
    type: "error"
  },
  { inputs: [], name: "ZeroAddressNotAllowed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" }
    ],
    name: "TransactionApproved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" }
    ],
    name: "TransactionCanceled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beneficiary",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddr",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unlockTime",
        type: "uint256"
      }
    ],
    name: "TransactionCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" }
    ],
    name: "TransactionDisputed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    inputs: [],
    name: "ADDRESSES_PROVIDER",
    outputs: [
      {
        internalType: "contract IPoolAddressesProvider",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "POOL",
    outputs: [{ internalType: "contract IPool", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "activeUserBeneficiaryEscrowTxMap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_escrowTxId", type: "uint256" }],
    name: "approveEscrowTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_escrowTxId", type: "uint256" }],
    name: "cancelEscrowTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_escrowTxId", type: "uint256" }],
    name: "closeDisputeAndApprove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_escrowTxId", type: "uint256" }],
    name: "closeDisputeAndCancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "counterEscrowTransactions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_beneficiary", type: "address" },
      { internalType: "address", name: "_tokenAddr", type: "address" },
      { internalType: "uint256", name: "_tokenAmount", type: "uint256" },
      { internalType: "uint256", name: "_unlockTime", type: "uint256" }
    ],
    name: "createEscrowTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "escrowTxsMap",
    outputs: [
      { internalType: "address payable", name: "beneficiary", type: "address" },
      { internalType: "address", name: "initiator", type: "address" },
      { internalType: "address", name: "tokenAddr", type: "address" },
      { internalType: "uint256", name: "tokenAmount", type: "uint256" },
      { internalType: "uint256", name: "unlockTime", type: "uint256" },
      {
        internalType: "enum EscrowVariables.EscrowStatus",
        name: "status",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_accountOne", type: "address" },
      { internalType: "address", name: "_accountTwo", type: "address" }
    ],
    name: "getActiveEscrowTransaction",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllEscrowsTx",
    outputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "beneficiary",
            type: "address"
          },
          { internalType: "address", name: "initiator", type: "address" },
          { internalType: "address", name: "tokenAddr", type: "address" },
          { internalType: "uint256", name: "tokenAmount", type: "uint256" },
          { internalType: "uint256", name: "unlockTime", type: "uint256" },
          {
            internalType: "enum EscrowVariables.EscrowStatus",
            name: "status",
            type: "uint8"
          }
        ],
        internalType: "struct EscrowVariables.EscrowTransaction[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_tokenAddr", type: "address" }],
    name: "getContractAtokenBalanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_tokenAddr", type: "address" }],
    name: "getContractBalanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getContractEtherBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "getEscrowTransaction",
    outputs: [
      {
        components: [
          {
            internalType: "address payable",
            name: "beneficiary",
            type: "address"
          },
          { internalType: "address", name: "initiator", type: "address" },
          { internalType: "address", name: "tokenAddr", type: "address" },
          { internalType: "uint256", name: "tokenAmount", type: "uint256" },
          { internalType: "uint256", name: "unlockTime", type: "uint256" },
          {
            internalType: "enum EscrowVariables.EscrowStatus",
            name: "status",
            type: "uint8"
          }
        ],
        internalType: "struct EscrowVariables.EscrowTransaction",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserAccountData",
    outputs: [
      { internalType: "uint256", name: "totalCollateralBase", type: "uint256" },
      { internalType: "uint256", name: "totalDebtBase", type: "uint256" },
      {
        internalType: "uint256",
        name: "availableBorrowsBase",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "currentLiquidationThreshold",
        type: "uint256"
      },
      { internalType: "uint256", name: "ltv", type: "uint256" },
      { internalType: "uint256", name: "healthFactor", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserEscrows",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_escrowTxId", type: "uint256" }],
    name: "initiateDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenAddr", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "rescueTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "userEscrowsMap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
] as const;
