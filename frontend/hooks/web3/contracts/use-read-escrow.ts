import { Address, formatEther } from "@/lib/web3-utils";
import { EscrowAbi } from "@/lib/abis/escrow-abi";
import { useReadContract } from "wagmi";

export const useReadEscrow = () => {
  const contractInfo = {
    address: "0xd53dD04Eca10f1458D0A860E5FAEF77aDD0B92A1" as Address,
    abi: EscrowAbi,
    chainId: 11155111
  };

  const {
    data: escrowTxsMap,
    refetch: refetchEscrowTxsMap,
    isLoading: isLoadingEscrowTxsMap,
    error: EscrowTxsMapError
  } = useReadContract({
    ...contractInfo,
    functionName: "escrowTxsMap"
  });

  const {
    data: contractEtherBalance,
    refetch: refetchContractEtherBalance,
    isLoading: isLoadingContractEtherBalance,
    error: contractEtherBalanceError,
    queryKey: contractEtherBalanceQueryKey
  } = useReadContract({
    ...contractInfo,
    functionName: "getContractEtherBalance",
    query: {
      select(data) {
        return formatEther(data);
      }
    }
  });

  return {
    contractEtherBalance,
    refetchContractEtherBalance,
    isLoadingContractEtherBalance,
    contractEtherBalanceError,
    contractEtherBalanceQueryKey,
    escrowTxsMap,
    refetchEscrowTxsMap,
    isLoadingEscrowTxsMap,
    EscrowTxsMapError
  };
};
