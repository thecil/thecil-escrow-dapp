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

const CancelEscrowButton = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  const { address } = useAccount();
  const { refetchGetAllEscrowsTx } = useReadEscrow();

  const _isInitiator = Boolean(address && address === escrowTx.initiator);
  const {
    data: cancelEscrowHash,
    isPending: isPendingCancelEscrow,
    writeContract: cancelEscrowTx
  } = useWriteContract();

  const {
    isLoading: isConfirmingCancelEscrow,
    isSuccess: isConfirmedCancelEscrow
  } = useWaitForTransactionReceipt({
    chainId: escrowContractInfo.chainId,
    confirmations: 1,
    hash: cancelEscrowHash,
    query: {
      enabled: Boolean(cancelEscrowHash)
    }
  });

  const handleCancel = () =>
    cancelEscrowTx(
      {
        ...escrowContractInfo,
        functionName: "cancelEscrowTransaction",
        args: [BigInt(escrowTx.id)]
      },
      {
        onSuccess: (data) => {
          console.log("cancelEscrowTransaction:onSuccess:", { data });
          toast.info("Cancel Escrow tx signed, waiting for confirmation");
        },
        onError: (error) => {
          console.log("cancelEscrowTransaction:onError:", { error });
          toast.error(
            `Error on Cancel Escrow: ${
              (error as BaseError).shortMessage || error.message
            }`
          );
        }
      }
    );

  // triggers transaction confirmations
  useEffect(() => {
    if (isConfirmedCancelEscrow) {
      toast.success(
        `Cancel Escrow Tx ID ${escrowTx.id} success, \n Hash:${cancelEscrowHash}`
      );
      refetchGetAllEscrowsTx();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedCancelEscrow]);
  return (
    <>
      {escrowTx.status === EscrowStatusEnum.Created && _isInitiator && (
        <Button
          variant={"destructive"}
          disabled={isPendingCancelEscrow || isConfirmingCancelEscrow}
          onMouseDown={handleCancel}
        >
          <div className="flex items-center space-x-1">
            {isPendingCancelEscrow ? (
              <FileSignature className="mr-2 h-4 w-4 animate-ping" />
            ) : null}
            {isConfirmingCancelEscrow ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <p>
              {isPendingCancelEscrow ? "Signing Tx" : null}
              {isConfirmingCancelEscrow ? "Canceling" : null}
              {!isPendingCancelEscrow && !isConfirmingCancelEscrow
                ? "Cancel"
                : null}
            </p>
          </div>
        </Button>
      )}
    </>
  );
};

export default CancelEscrowButton;
