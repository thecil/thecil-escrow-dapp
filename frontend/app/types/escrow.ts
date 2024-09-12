import { Address } from "@/lib/web3-utils";

export enum EscrowStatus {
  Created = "created",
  Approved = "approved",
  Canceled = "canceled",
  Dispute = "dispute",
}

export interface EscrowTransaction {
  beneficiary: Address;
  initiator: Address;
  tokenAddr: Address;
  tokenAmount: bigint;
  unlockTime: bigint;
  status: EscrowStatus;
}
