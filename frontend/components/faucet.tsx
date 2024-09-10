import React, { useEffect } from "react";
import { AaveTokens, sepoliaAaveReserveTokens } from "@/lib/aave-contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "./ui/button";

import Image from "next/image";
import { testnetErc20Abi } from "@/lib/abis/testnetErc20-abi";
import { faucetAbi } from "@/lib/abis/faucet-abi";
import {
  BaseError,
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { Address, formatUnits, parseUnits } from "@/lib/web3-utils";
import { sepoliaAaveContracts } from "@/lib/aave-contracts";
import { toast } from "sonner";

// controls show balance and minting
const TokenController = ({ token }: { token: AaveTokens }) => {
  const { address, isConnected } = useAccount();
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: token.address as Address,
    abi: testnetErc20Abi,
    chainId: 11155111,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      // select(data) {
      //   return formatEther(data);
      // },
      enabled: isConnected
    }
  });

  const { data: tokenDecimals } =
    useReadContract({
      address: token.address as Address,
      abi: testnetErc20Abi,
      chainId: 11155111,
      functionName: "decimals",
      query: {
        enabled: isConnected
      }
    });

  const {
    data: mintingHash,
    isPending: isPendingMinting,
    writeContract: mintToken
  } = useWriteContract();

  const { isLoading: isConfirmingMinting, isSuccess: isConfirmedMinting } =
    useWaitForTransactionReceipt({
      chainId: 11155111,
      confirmations: 1,
      hash: mintingHash,
      query: {
        enabled: Boolean(mintingHash)
      }
    });

  const handleMinting = () =>
    mintToken(
      {
        address: sepoliaAaveContracts.faucet,
        abi: faucetAbi,
        chainId: 11155111,
        functionName: "mint",
        args: [
          token.address,
          address as Address,
          parseUnits("1000", tokenDecimals as number)
        ]
      },
      {
        onSuccess: (data) => {
          console.log("mintToken:onSuccess:", { data });
          toast.info("Mint transaction signed, waiting for confirmation");
        },
        onError: (error) => {
          console.log("mintToken:onError:", { error });
          toast.error(
            `Error on minting: ${
              (error as BaseError).shortMessage || error.message
            }`
          );
        }
      }
    );

  // triggers transaction confirmations
  useEffect(() => {
    if (isConfirmedMinting) {
      toast.success(
        `Enter Agreement transaction success, \n Hash:${mintingHash}`
      );
      refetchTokenBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedMinting]);

  return (
    <div className="grid gap-1 border rounded-md p-4 h-24">
      <div className="flex gap-2 items-center">
        <Image
          width={100}
          height={100}
          className="w-4 h-4"
          alt="token-logo"
          src={token.img}
        />
        <p className="font-semibold">{token.name}</p>
      </div>
      {tokenBalance &&
      tokenDecimals &&
      tokenBalance > parseUnits("1", tokenDecimals as number) ? (
          <p>{Number(formatUnits(tokenBalance, tokenDecimals)).toFixed(2)}</p>
        ) : (
          <Button
            disabled={isPendingMinting || isConfirmingMinting}
            variant={"outline"}
            onMouseDown={handleMinting}
          >
            {isPendingMinting || isConfirmingMinting ? "Minting" : "Mint"}
          </Button>
        )}
    </div>
  );
};
const Faucet = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1 - Token Balances</CardTitle>
        <CardDescription className="w-48 md:w-full">
          Check your token balances or mint tokens if your empty.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 md:flex">
        {sepoliaAaveReserveTokens.map((token: AaveTokens) => (
          <div key={token.name}>
            <TokenController token={token} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Faucet;
