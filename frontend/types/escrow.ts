import { Address } from "@/lib/web3-utils";

export const EscrowStatus = ["Created", "Approved", "Canceled", "Dispute"];

export interface EscrowTx {
  beneficiary: Address;
  initiator: Address;
  tokenAddr: Address;
  tokenAmount: bigint;
  unlockTime: bigint;
  status: number;
  id: number;
}
