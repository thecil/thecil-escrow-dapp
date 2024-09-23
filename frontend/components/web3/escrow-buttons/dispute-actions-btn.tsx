import { Button } from "@/components/ui/button";
import { EscrowTx, EscrowStatusEnum } from "@/types/escrow";
import {
  escrowContractInfo,
  useReadEscrow
} from "@/hooks/web3/contracts/use-read-escrow";
import { FileSignature, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { unixNow } from "@/lib/unix-time";

const DisputeActionsButton = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  const { address } = useAccount();
  const { refetchGetAllEscrowsTx } = useReadEscrow();

  const _isInitiator = Boolean(address && address === escrowTx.initiator);
  const _isUnlocked = Boolean(escrowTx.unlockTime < BigInt(unixNow()));

  const {
    data: cancelDisputeHash,
    isPending: isPendingCancelDispute,
    writeContract: cancelDisputeTx
  } = useWriteContract();

  const {
    isLoading: isConfirmingCancelDispute,
    isSuccess: isConfirmedCancelDispute
  } = useWaitForTransactionReceipt({
    chainId: escrowContractInfo.chainId,
    confirmations: 1,
    hash: cancelDisputeHash,
    query: {
      enabled: Boolean(cancelDisputeHash)
    }
  });

  const {
    data: approveDisputeHash,
    isPending: isPendingApproveDispute,
    writeContract: approveDisputeTx
  } = useWriteContract();

  const {
    isLoading: isConfirmingApproveDispute,
    isSuccess: isConfirmedApproveDispute
  } = useWaitForTransactionReceipt({
    chainId: escrowContractInfo.chainId,
    confirmations: 1,
    hash: approveDisputeHash,
    query: {
      enabled: Boolean(approveDisputeHash)
    }
  });

  const handleApprove = () =>
    approveDisputeTx(
      {
        ...escrowContractInfo,
        functionName: "closeDisputeAndApprove",
        args: [BigInt(escrowTx.id)]
      },
      {
        onSuccess: (data) => {
          console.log("closeDisputeAndApprove:onSuccess:", { data });
          toast.info("Approve Dispute tx signed, waiting for confirmation");
        },
        onError: (error) => {
          console.log("closeDisputeAndApprove:onError:", { error });
          toast.error(
            `Error on Approve Dispute: ${
              (error as BaseError).metaMessages?.at(0) || error.message
            }`
          );
        }
      }
    );

  const handleCancel = () =>
    cancelDisputeTx(
      {
        ...escrowContractInfo,
        functionName: "closeDisputeAndCancel",
        args: [BigInt(escrowTx.id)]
      },
      {
        onSuccess: (data) => {
          console.log("closeDisputeAndCancel:onSuccess:", { data });
          toast.info("Cancel Dispute tx signed, waiting for confirmation");
        },
        onError: (error) => {
          console.log("closeDisputeAndCancel:onError:", { error });
          toast.error(
            `Error on Cancel Dispute: ${
              (error as BaseError).metaMessages?.at(0) || error.message
            }`
          );
        }
      }
    );

  // triggers transaction confirmations
  useEffect(() => {
    if (isConfirmedCancelDispute) {
      toast.success(
        `Cancel Dispute Tx ID ${escrowTx.id} success, \n Hash:${cancelDisputeHash}`
      );
      refetchGetAllEscrowsTx();
    }
    if (isConfirmedApproveDispute) {
      toast.success(
        `Approve Dispute Tx ID ${escrowTx.id} success, \n Hash:${cancelDisputeHash}`
      );
      refetchGetAllEscrowsTx();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedCancelDispute, isConfirmedApproveDispute]);
  return (
    <>
      {escrowTx.status === EscrowStatusEnum.Dispute && _isInitiator && (
        <>
          {_isUnlocked && (
            <Button
              size={"sm"}
              variant={"outline"}
              disabled={isPendingApproveDispute || isConfirmingApproveDispute}
              onMouseDown={handleApprove}
            >
              <div className="flex items-center space-x-1">
                {isPendingApproveDispute ? (
                  <FileSignature className="mr-2 h-4 w-4 animate-ping" />
                ) : null}
                {isConfirmingApproveDispute ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                <p>
                  {isPendingApproveDispute ? "Signing Tx" : null}
                  {isConfirmingApproveDispute ? "Approving" : null}
                  {!isPendingApproveDispute && !isConfirmingApproveDispute
                    ? "Approve Dispute"
                    : null}
                </p>
              </div>
            </Button>
          )}
          <Button
            size={"sm"}
            variant={"outline"}
            disabled={isPendingCancelDispute || isConfirmingCancelDispute}
            onMouseDown={handleCancel}
          >
            <div className="flex items-center space-x-1">
              {isPendingCancelDispute ? (
                <FileSignature className="mr-2 h-4 w-4 animate-ping" />
              ) : null}
              {isConfirmingCancelDispute ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              <p>
                {isPendingCancelDispute ? "Signing Tx" : null}
                {isConfirmingCancelDispute ? "Canceling" : null}
                {!isPendingCancelDispute && !isConfirmingCancelDispute
                  ? "Close Dispute"
                  : null}
              </p>
            </div>
          </Button>
        </>
      )}
    </>
  );
};

export default DisputeActionsButton;
