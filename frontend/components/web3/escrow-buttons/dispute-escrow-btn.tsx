"use client";

import { Button } from "@/components/ui/button";
import {
  useReadEscrow
} from "@/hooks/web3/contracts/use-read-escrow";
import { EscrowStatusEnum, EscrowTx } from "@/types/escrow";
import { FileSignature, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import DisputeActionsButton from "./dispute-actions-btn";
import { escrowContractInfo } from "@/config/global-config";

const DisputeEscrowButton = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  const { address } = useAccount();
  const { refetchGetAllEscrowsTx } = useReadEscrow();
  const _isBeneficiary = Boolean(address && address === escrowTx.beneficiary);
  const _isInitiator = Boolean(address && address === escrowTx.initiator);
  const _isParticipant = Boolean(_isBeneficiary || _isInitiator);
  const {
    data: disputeEscrowHash,
    isPending: isPendingDisputeEscrow,
    writeContract: disputeEscrowTx
  } = useWriteContract();

  const {
    isLoading: isConfirmingDisputeEscrow,
    isSuccess: isConfirmedDisputeEscrow
  } = useWaitForTransactionReceipt({
    chainId: escrowContractInfo.chainId,
    confirmations: 1,
    hash: disputeEscrowHash,
    query: {
      enabled: Boolean(disputeEscrowHash)
    }
  });

  const handleApproval = () =>
    disputeEscrowTx(
      {
        ...escrowContractInfo,
        functionName: "initiateDispute",
        args: [BigInt(escrowTx.id)]
      },
      {
        onSuccess: (data) => {
          console.log("initiateDispute:onSuccess:", { data });
          toast.info("Dispute Escrow tx signed, waiting for confirmation");
        },
        onError: (error) => {
          console.log("initiateDispute:onError:", { error });
          toast.error(
            `Error on Dispute Escrow: ${
              (error as BaseError).metaMessages?.at(0) || error.message
            }`
          );
        }
      }
    );

  // triggers transaction confirmations
  useEffect(() => {
    if (isConfirmedDisputeEscrow) {
      toast.success(
        `Dispute Escrow Tx ID ${escrowTx.id} success, \n Hash:${disputeEscrowHash}`
      );
      refetchGetAllEscrowsTx();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedDisputeEscrow]);

  return (
    <>
      {escrowTx.status === EscrowStatusEnum.Created && _isParticipant && (
        <Button
          variant={"secondary"}
          disabled={isPendingDisputeEscrow || isConfirmingDisputeEscrow}
          onMouseDown={handleApproval}
        >
          <div className="flex items-center space-x-1">
            {isPendingDisputeEscrow ? (
              <FileSignature className="mr-2 h-4 w-4 animate-ping" />
            ) : null}
            {isConfirmingDisputeEscrow ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <p>
              {isPendingDisputeEscrow ? "Signing Tx" : null}
              {isConfirmingDisputeEscrow ? "Entering Dispute" : null}
              {!isPendingDisputeEscrow && !isConfirmingDisputeEscrow
                ? "Dispute"
                : null}
            </p>
          </div>
        </Button>
      )}
      {escrowTx.status === EscrowStatusEnum.Dispute && _isInitiator && (
        <DisputeActionsButton escrowTx={escrowTx} />
      )}
    </>
  );
};

export default DisputeEscrowButton;
