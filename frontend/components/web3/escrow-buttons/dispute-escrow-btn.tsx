"use client";

import { Button } from "@/components/ui/button";
import { unixNow } from "@/lib/unix-time";
import { EscrowStatusEnum, EscrowTx } from "@/types/escrow";
import React from "react";
import { useAccount } from "wagmi";

const DisputeEscrowButton = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  const { address } = useAccount();
  const _isInitiator = Boolean(address && address === escrowTx.initiator);
  const _isBeneficiary = Boolean(address && address === escrowTx.beneficiary);
  const _isParticipant = Boolean(_isInitiator || _isBeneficiary);
  const _isUnlocked = Boolean(escrowTx.unlockTime < BigInt(unixNow()));
  return (
    <>
      {escrowTx.status === EscrowStatusEnum.Created && _isParticipant && (
        <Button variant={"secondary"}>Dispute</Button>
      )}
      {escrowTx.status === EscrowStatusEnum.Dispute &&
        _isInitiator &&
        _isUnlocked && (
        <>
          <Button variant={"secondary"}>Approve Dispute</Button>
          <Button variant={"secondary"}>Cancel Dispute</Button>
        </>
      )}
    </>
  );
};

export default DisputeEscrowButton;
