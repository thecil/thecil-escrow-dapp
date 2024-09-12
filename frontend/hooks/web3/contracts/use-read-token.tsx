"use client";

import { useReadContract, useAccount, useChainId } from "wagmi";
import { testnetErc20Abi } from "@/lib/abis/testnetErc20-abi";
import { Address, formatUnits } from "@/lib/web3-utils";
import { useState } from "react";

export const useReadToken = () => {
  const [tokenAddress, setTokenAddress] = useState<Address | undefined>();
  const [allowanceSpender, setTokenAllowanceSpender] = useState<
    Address | undefined
  >();
  const [tokenBalanceOf, setTokenBalanceOf] = useState<Address | undefined>();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
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
    functionName: "decimals",
    query: {
      enabled: Boolean(tokenAddress)
    }
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
    decimals,
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
    tokenAddress,
    allowanceSpender,
    tokenBalanceOf,
    setTokenAddress,
    setTokenAllowanceSpender,
    setTokenBalanceOf
  };
};
