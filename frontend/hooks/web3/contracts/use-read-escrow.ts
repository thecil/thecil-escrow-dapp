import { Address, formatEther } from "@/lib/web3-utils";
import { useAccount, useReadContract } from "wagmi";
import { useState } from "react";
import { escrowContractInfo } from "@/config/global-config";

export const useReadEscrow = () => {
  const [escrowTxId, setEscrowTxId] = useState<string>("0");
  const { address, isConnected } = useAccount();

  const {
    data: getEscrowTransaction,
    refetch: refetchGetEscrowTransaction,
    isLoading: isLoadingGetEscrowTransaction,
    error: getEscrowTransactionError
  } = useReadContract({
    ...escrowContractInfo,
    functionName: "getEscrowTransaction",
    args: [BigInt(escrowTxId)],
    query: {
      enabled: Boolean(escrowTxId !== "0")
    }
  });

  const {
    data: contractEtherBalance,
    refetch: refetchContractEtherBalance,
    isLoading: isLoadingContractEtherBalance,
    error: contractEtherBalanceError,
    queryKey: contractEtherBalanceQueryKey
  } = useReadContract({
    ...escrowContractInfo,
    functionName: "getContractEtherBalance",
    query: {
      select(data) {
        return formatEther(data);
      }
    }
  });

  const {
    data: getAllEscrowsTx,
    refetch: refetchGetAllEscrowsTx,
    isLoading: isLoadingGetAllEscrowsTx,
    error: getAllEscrowsTxError
  } = useReadContract({
    ...escrowContractInfo,
    functionName: "getAllEscrowsTx",
    query: {
      select(data) {
        const _escrowsTx = data.map((escrowTx, index) => {
          return {
            id: index + 1,
            ...escrowTx
          };
        });
        return _escrowsTx;
      }
    }
  });

  const {
    data: getUserEscrows,
    refetch: refetchGetUserEscrows,
    isLoading: isLoadingGetUserEscrows,
    error: getUserEscrowsError
  } = useReadContract({
    ...escrowContractInfo,
    functionName: "getUserEscrows",
    args: [address as Address],
    query: {
      enabled: Boolean(address && isConnected)
    }
  });

  return {
    contractEtherBalance,
    refetchContractEtherBalance,
    isLoadingContractEtherBalance,
    contractEtherBalanceError,
    contractEtherBalanceQueryKey,
    escrowTxId,
    setEscrowTxId,
    getEscrowTransaction,
    refetchGetEscrowTransaction,
    isLoadingGetEscrowTransaction,
    getEscrowTransactionError,
    getUserEscrows,
    refetchGetUserEscrows,
    isLoadingGetUserEscrows,
    getUserEscrowsError,
    getAllEscrowsTx,
    refetchGetAllEscrowsTx,
    isLoadingGetAllEscrowsTx,
    getAllEscrowsTxError
  };
};
