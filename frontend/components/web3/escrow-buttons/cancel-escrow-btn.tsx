import { Button } from "@/components/ui/button";
import { EscrowTx, EscrowStatusEnum } from "@/types/escrow";
import React from "react";
import { useAccount } from "wagmi";

const CancelEscrowButton = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  const { address } = useAccount();
  const _isInitiator = Boolean(address && address === escrowTx.initiator);
  return (
    <>
      {escrowTx.status === EscrowStatusEnum.Created && _isInitiator && (
        <Button variant="destructive">Cancel</Button>
      )}
    </>
  );
};

export default CancelEscrowButton;
