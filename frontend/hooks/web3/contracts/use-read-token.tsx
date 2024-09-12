"use client";

import { useReadContract, useAccount } from "wagmi";
import { testnetErc20Abi } from "@/lib/abis/testnetErc20-abi";
import { Address } from "@/lib/web3-utils";
import { formatUnits } from "viem";

export const useReadToken = ({
  tokenAddress,
  chainId,
  allowanceSpender,
  tokenBalanceOf
}: {
  tokenAddress: Address;
  chainId: number;
    allowanceSpender?: Address;
    tokenBalanceOf?: Address;
}) => {
  const { address, isConnected } = useAccount();
  const contractInfo = {
    address: tokenAddress,
    abi: testnetErc20Abi,
    chainId: chainId
  };

  const defaultQueryOptions = {
    refetchInterval: 60 * 60 * 1000 // every hour
  };

  const { data: decimals } = useReadContract({
    ...contractInfo,
    functionName: "decimals"
  });

  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isLoadingAllowance,
    isError: isErrorAllowance
  } = useReadContract({
    ...contractInfo,
    functionName: "allowance",
    args: [address as Address, allowanceSpender as Address],
    query: {
      enabled: Boolean(isConnected && address && allowanceSpender && decimals),
      select: (data) => formatUnits(data, decimals as number)
    }
  });

  const {
    data: balanceOfConnectedAccount,
    refetch: refetchBalanceOfConnectedAccount,
    isLoading: isLoadingBalanceOfConnectedAccount,
    isError: isErrorBalanceOfConnectedAccount
  } = useReadContract({
    ...contractInfo,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      ...defaultQueryOptions,
      enabled: Boolean(isConnected && address),
      select: (data) =>
        parseFloat(formatUnits(data, decimals as number)).toFixed(2)
    }
  });

  const {
    data: balanceOfAddress,
    refetch: refetchBalanceOfAddress,
    isLoading: isLoadingBalanceOfAddress,
    isError: isErrorBalanceOfAddress
  } = useReadContract({
    ...contractInfo,
    functionName: "balanceOf",
    args: [tokenBalanceOf as Address],
    query: {
      ...defaultQueryOptions,
      enabled: Boolean(tokenBalanceOf),
      select: (data) =>
        parseFloat(formatUnits(data, decimals as number)).toFixed(2)
    }
  });

  return {
    allowance,
    refetchAllowance,
    isLoadingAllowance,
    isErrorAllowance,
    balanceOfConnectedAccount,
    refetchBalanceOfConnectedAccount,
    isLoadingBalanceOfConnectedAccount,
    isErrorBalanceOfConnectedAccount,
    balanceOfAddress,
    refetchBalanceOfAddress,
    isLoadingBalanceOfAddress,
    isErrorBalanceOfAddress,
    decimals
  };
};
