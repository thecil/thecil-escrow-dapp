import React, { useEffect } from "react";
import { AaveTokens, sepoliaAaveReserveTokens } from "@/lib/aave-contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "../ui/button";

import Image from "next/image";
import { faucetAbi } from "@/lib/abis/faucet-abi";
import {
  BaseError,
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { Address, parseUnits } from "@/lib/web3-utils";
import { sepoliaAaveContracts } from "@/lib/aave-contracts";
import { toast } from "sonner";
import { useReadToken } from "@/hooks/web3/contracts/use-read-token";
import { FileSignature, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// controls show balance and minting
const TokenController = ({ token }: { token: AaveTokens }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const {
    balanceOfConnectedAccount,
    refetchBalanceOfConnectedAccount,
    decimals
  } = useReadToken({ tokenAddress: token.address, chainId });

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
          parseUnits("1000", decimals as number)
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
            `Error on minting: ${token.name} - ${
              (error as BaseError).shortMessage || error.message
            }`
          );
        }
      }
    );

  // triggers transaction confirmations
  useEffect(() => {
    if (isConfirmedMinting) {
      toast.success(`Minting transaction success, \n Hash:${mintingHash}`);
      refetchBalanceOfConnectedAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedMinting]);

  const mintTxStatusColor = (): string => {
    return isPendingMinting
      ? "border-blue-900 border-2"
      : isConfirmingMinting
        ? "border-green-900 border-2"
        : "border";
  };
  return (
    <div className={cn(mintTxStatusColor(), "grid gap-1  rounded-md p-4 h-24")}>
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
      {balanceOfConnectedAccount && balanceOfConnectedAccount > "1" ? (
        <p>{balanceOfConnectedAccount}</p>
      ) : (
        <Button
          disabled={isPendingMinting || isConfirmingMinting}
          variant={"outline"}
          onMouseDown={handleMinting}
        >
          <div className="flex items-center space-x-1">
            {isPendingMinting ? (
              <FileSignature className="mr-2 h-4 w-4 animate-ping" />
            ) : null}
            {isConfirmingMinting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <p>
              {isPendingMinting ? "Signing Tx" : null}
              {isConfirmingMinting ? "Minting" : null}
              {!isPendingMinting && !isConfirmingMinting ? "Mint" : null}
            </p>
          </div>
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
