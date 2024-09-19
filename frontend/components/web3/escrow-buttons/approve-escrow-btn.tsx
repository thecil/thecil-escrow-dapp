"use client";

import { Button } from "@/components/ui/button";
import {
  escrowContractInfo,
  useReadEscrow
} from "@/hooks/web3/contracts/use-read-escrow";
import { unixNow } from "@/lib/unix-time";
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

const ApproveEscrowButton = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  const { address } = useAccount();
  const { refetchGetAllEscrowsTx } = useReadEscrow();
  const _isInitiator = Boolean(address && address === escrowTx.initiator);
  const _isUnlocked =
    Boolean(escrowTx.unlockTime < BigInt(unixNow())) &&
    Boolean(escrowTx.status === EscrowStatusEnum.Created && _isInitiator);

  const {
    data: approveEscrowHash,
    isPending: isPendingApproveEscrow,
    writeContract: approveEscrowTx
  } = useWriteContract();

  const {
    isLoading: isConfirmingApproveEscrow,
    isSuccess: isConfirmedApproveEscrow
  } = useWaitForTransactionReceipt({
    chainId: escrowContractInfo.chainId,
    confirmations: 1,
    hash: approveEscrowHash,
    query: {
      enabled: Boolean(approveEscrowHash)
    }
  });

  const handleApproval = () =>
    approveEscrowTx(
      {
        ...escrowContractInfo,
        functionName: "approveEscrowTransaction",
        args: [BigInt(escrowTx.id)]
      },
      {
        onSuccess: (data) => {
          console.log("approveEscrowTransaction:onSuccess:", { data });
          toast.info("Approve Escrow tx signed, waiting for confirmation");
        },
        onError: (error) => {
          console.log("approveEscrowTransaction:onError:", { error });
          toast.error(
            `Error on Approve Escrow: ${
              (error as BaseError).shortMessage || error.message
            }`
          );
        }
      }
    );

  // triggers transaction confirmations
  useEffect(() => {
    if (isConfirmedApproveEscrow) {
      toast.success(
        `Approve Escrow Tx ID ${escrowTx.id} success, \n Hash:${approveEscrowHash}`
      );
      refetchGetAllEscrowsTx();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedApproveEscrow]);
  return (
    <>
      {_isUnlocked && (
        <Button
          disabled={isPendingApproveEscrow || isConfirmingApproveEscrow}
          onMouseDown={handleApproval}
        >
          <div className="flex items-center space-x-1">
            {isPendingApproveEscrow ? (
              <FileSignature className="mr-2 h-4 w-4 animate-ping" />
            ) : null}
            {isConfirmingApproveEscrow ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <p>
              {isPendingApproveEscrow ? "Signing Tx" : null}
              {isConfirmingApproveEscrow ? "Approving" : null}
              {!isPendingApproveEscrow && !isConfirmingApproveEscrow
                ? "Approve"
                : null}
            </p>
          </div>
        </Button>
      )}
    </>
  );
};

export default ApproveEscrowButton;
