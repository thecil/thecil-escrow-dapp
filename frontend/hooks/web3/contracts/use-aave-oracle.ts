import { aaveOracleAbi } from "@/lib/abis/aave-oracle-abi";
import { useState } from "react";
import { Address, formatUnits } from "@/lib/web3-utils";
import { useChainId, useReadContract } from "wagmi";
import { sepoliaAaveReserveTokens } from "@/lib/aave-contracts";

export const useAaveOracle = () => {
  const [assetAddress, setAssetAddress] = useState<Address | undefined>();
  const chainId = useChainId();
  const contractInto = {
    address: "0x2da88497588bf89281816106C7259e31AF45a663" as Address,
    abi: aaveOracleAbi,
    chainId: chainId
  };

  const {
    data: getAssetsPrices,
    refetch: refetchGetAssetsPrices,
    isLoading: isLoadingGetAssetsPrices,
    error: getAssetsPricesError
  } = useReadContract({
    ...contractInto,
    functionName: "getAssetsPrices",
    args: [
      sepoliaAaveReserveTokens.map((rToken) => rToken.address) as Address[]
    ],
    query: {
      select: (data) => {
        return data?.map((result, index) => {
          return {
            ...sepoliaAaveReserveTokens[index],
            priceInBn: result,
            priceFormat: parseFloat(formatUnits(result, 8)).toFixed(2)
          };
        });
      }
    }
  });

  const {
    data: getAssetPrice,
    refetch: refetchGetAssetPrice,
    isLoading: isLoadingGetAssetPrice,
    error: getAssetPriceError
  } = useReadContract({
    ...contractInto,
    functionName: "getAssetPrice",
    args: [assetAddress as Address],
    query: {
      enabled: Boolean(assetAddress),
      select: (data) => parseFloat(formatUnits(data, 8)).toFixed(2)
    }
  });

  return {
    assetAddress,
    setAssetAddress,
    getAssetsPrices,
    refetchGetAssetsPrices,
    isLoadingGetAssetsPrices,
    getAssetsPricesError,
    getAssetPrice,
    refetchGetAssetPrice,
    isLoadingGetAssetPrice,
    getAssetPriceError
  };
};
