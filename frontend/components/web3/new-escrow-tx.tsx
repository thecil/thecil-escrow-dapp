"use client";

import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type BaseError,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
  useAccount
} from "wagmi";
import { useReadToken } from "@/hooks/web3/contracts/use-read-token";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FileSignature, Loader2, TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { NewEscrowSchemaFormInputs, newEscrowSchema } from "@/lib/zod-schemas";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { sepoliaAaveReserveTokens } from "@/lib/aave-contracts";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Address, parseUnits } from "viem";
import { testnetErc20Abi } from "@/lib/abis/testnetErc20-abi";
import { toUnixTime } from "@/lib/unix-time";
import { escrowContractInfo, useReadEscrow } from "@/hooks/web3/contracts/use-read-escrow";
import { useScreenSize } from "@/hooks/use-screen-size";
import { shortAddress } from "@/lib/web3-utils";

const NewEscrowTxForm = () => {
  const { isMobile } = useScreenSize();
  const chainId = useChainId();
  const { address } = useAccount();
  const { refetchGetAllEscrowsTx } = useReadEscrow();
  const {
    tokenAddress,
    setTokenAddress,
    setTokenAllowanceSpender,
    allowance,
    refetchAllowance,
    balanceOfConnectedAccount,
    refetchBalanceOfConnectedAccount,
    decimals
  } = useReadToken();

  const {
    data: approveHash,
    isPending: isPendingApprove,
    writeContract: approveEscrowContract
  } = useWriteContract();

  const { isLoading: isConfirmingApproval, isSuccess: isConfirmedApproval } =
    useWaitForTransactionReceipt({
      chainId: chainId,
      confirmations: 1,
      hash: approveHash,
      query: {
        enabled: Boolean(approveHash)
      }
    });

  const {
    data: createEscrowTxHash,
    isPending: isPendingCreateEscrowTx,
    writeContract: createEscrowTx
  } = useWriteContract();

  const {
    isLoading: isConfirmingCreateEscrowTx,
    isSuccess: isConfirmedCreateEscrowTx
  } = useWaitForTransactionReceipt({
    chainId: chainId,
    confirmations: 1,
    hash: createEscrowTxHash,
    query: {
      enabled: Boolean(createEscrowTxHash)
    }
  });

  const form = useForm<NewEscrowSchemaFormInputs>({
    resolver: zodResolver(newEscrowSchema),
    defaultValues: {
      beneficiary: "",
      tokenAddress: "",
      tokenAmount: "",
      unlockTime: undefined
    }
  });
  const onSubmit = (values: NewEscrowSchemaFormInputs) => {
    if (!decimals) return;
    const _tokenAmountInBn = parseUnits(values.tokenAmount, decimals);
    console.log("newEscrowForm:onSubmit:", {
      original: values,
      converted: _tokenAmountInBn
    });
    const tokenContractInfo = {
      address: values.tokenAddress as Address,
      abi: testnetErc20Abi,
      chainId: chainId
    };

    if (allowance && Number(allowance) < Number(_selectedAmount)) {
      approveEscrowContract(
        {
          ...tokenContractInfo,
          functionName: "approve",
          args: [escrowContractInfo.address as Address, _tokenAmountInBn]
        },
        {
          onSuccess: (data) => {
            console.log("approveEscrowContract:onSuccess:", { data });
            toast.info("Approval transaction signed, waiting for confirmation");
          },
          onError: (error) => {
            console.log("approveEscrowContract:onError:", { error });
            toast.error(
              `Approve Escrow: ${
                (error as BaseError).shortMessage || error.message
              }`
            );
          }
        }
      );
    } else {
      createEscrowTx(
        {
          ...escrowContractInfo,
          functionName: "createEscrowTransaction",
          args: [
            values.beneficiary as Address,
            values.tokenAddress as Address,
            _tokenAmountInBn,
            BigInt(toUnixTime(values.unlockTime))
          ]
        },
        {
          onSuccess: (data) => {
            console.log("createEscrowTransaction:onSuccess:", { data });
            toast.info(
              "Create Escrow transaction signed, waiting for confirmation"
            );
            form.reset();
          },
          onError: (error) => {
            console.log("createEscrowTransaction:onError:", { error });
            toast.error(
              `Create Escrow: ${
                (error as BaseError).metaMessages?.at(0) || error.message
              }`
            );
          }
        }
      );
    }
  };

  const _selectedBeneficiary = form.watch("beneficiary");
  const _selectedToken = form.watch("tokenAddress");
  const _selectedAmount = form.watch("tokenAmount");
  const _selectedUnlockTime = form.watch("unlockTime");

  const _txDetailsString = useMemo(() => {
    const _token = sepoliaAaveReserveTokens.find(
      (token) => token.address === _selectedToken
    );
    if (!_token) return undefined;
    return {
      ..._token,
      beneficiary: _selectedBeneficiary,
      amount: _selectedAmount,
      unlockTime: _selectedUnlockTime
    };
  }, [
    _selectedBeneficiary,
    _selectedToken,
    _selectedAmount,
    _selectedUnlockTime
  ]);

  // initiate read token hook when an token is selected or changed
  useEffect(() => {
    const _fieldState = form.getFieldState("tokenAddress");
    // validate fields
    if (_selectedToken && !_fieldState.invalid) {
      // when different token than hook is selected
      if (tokenAddress !== _selectedToken) {
        setTokenAddress(_selectedToken as Address);
        refetchBalanceOfConnectedAccount();
        setTokenAllowanceSpender(escrowContractInfo.address);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_selectedToken]);

  // triggers transaction confirmations
  useEffect(() => {
    if (isConfirmedCreateEscrowTx) {
      toast.success(
        `Escrow transaction success, \n Hash:${createEscrowTxHash}`
      );
      refetchAllowance();
      refetchBalanceOfConnectedAccount();
      refetchGetAllEscrowsTx();
    }
    if (isConfirmedApproval) {
      toast.success(
        `Token approve transaction success, \n Hash:${approveHash}`
      );
      refetchAllowance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmedCreateEscrowTx, isConfirmedApproval]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="tokenAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sepoliaAaveReserveTokens.map((token, index) => (
                      <SelectItem key={index} value={token.address}>
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
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the token to be used for this escrow contract
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />

          <FormField
            control={form.control}
            name="tokenAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Amount</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-between space-x-1">
                    <Input placeholder="0.05" {...field} />
                    {balanceOfConnectedAccount && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          form.setValue(
                            "tokenAmount",
                            balanceOfConnectedAccount
                          )
                        }
                      >
                        MAX
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  The amount of token deposited into the contract to be released
                  to the beneficiary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />

          <FormField
            control={form.control}
            name="beneficiary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiary</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The account that will receive the funds.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />

          <FormField
            control={form.control}
            name="unlockTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Unlock Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Time that must pass before the escrow can release the funds to
                  the beneficiary.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          {allowance && Number(allowance) < Number(_selectedAmount) ? (
            <div className="flex gap-2 items-center">
              <Button
                disabled={
                  isPendingApprove ||
                  isConfirmingApproval ||
                  _selectedBeneficiary === address
                }
                className="w-fit"
                type="submit"
              >
                <div className="flex items-center space-x-1">
                  {isPendingApprove ? (
                    <FileSignature className="mr-2 h-4 w-4 animate-ping" />
                  ) : null}
                  {isConfirmingApproval ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  <p>
                    {isPendingApprove ? "Signing Tx" : null}
                    {isConfirmingApproval ? "Approving" : null}
                    {!isPendingApprove && !isConfirmingApproval
                      ? "Approve"
                      : null}
                  </p>
                </div>
              </Button>
              <div className="flex items-center gap-2">
                <TriangleAlert
                  className={`${
                    _selectedBeneficiary === address
                      ? "text-red-500"
                      : "text-yellow-500"
                  } h-8 w-8`}
                />
                <p className="text-sm">
                  {_selectedBeneficiary === address
                    ? "Beneficiary can not be the same as the initiator, select another address as beneficiary"
                    : "Approve the escrow contract to spend your tokens on your behalf"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Button
                disabled={
                  isPendingCreateEscrowTx ||
                  isConfirmingCreateEscrowTx ||
                  _selectedBeneficiary === address
                }
                className="w-fit"
                type="submit"
              >
                <div className="flex items-center space-x-1">
                  {isPendingCreateEscrowTx ? (
                    <FileSignature className="mr-2 h-4 w-4 animate-ping" />
                  ) : null}
                  {isConfirmingCreateEscrowTx ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  <p>
                    {isPendingCreateEscrowTx ? "Signing Tx" : null}
                    {isConfirmingCreateEscrowTx ? "Creating Escrow" : null}
                    {!isPendingCreateEscrowTx && !isConfirmingCreateEscrowTx
                      ? "Create Escrow"
                      : null}
                  </p>
                </div>
                {_selectedBeneficiary === address && (
                  <div className="flex items-center gap-2">
                    <TriangleAlert className="text-red-500 h-8 w-8" />
                    <p className="text-sm">
                      Beneficiary can not be the same as the initiator, select
                      another address as beneficiary
                    </p>
                  </div>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
      <div className="flex flex-col gap-2 border rounded-md p-2">
        <p className="text-2xl font-semibold h-fit">Transaction Details</p>
        <Separator />
        <div className="grid gap-2 h-fit">
          {_txDetailsString ? (
            <>
              <div className="flex gap-2 items-center">
                <p>Will send</p>
                <p className="font-semibold">{_txDetailsString.amount}</p>
                <Image
                  src={_txDetailsString.img}
                  alt="token-logo"
                  width={100}
                  height={100}
                  className="w-5 h-5"
                />
                <p className="font-semibold">{_txDetailsString.name}</p>
              </div>
              <div className="flex gap-2 items-center">
                {" "}
                <p>To:</p>
                <p className="font-semibold">
                  {isMobile
                    ? shortAddress(_txDetailsString.beneficiary)
                    : _txDetailsString.beneficiary}
                </p>
              </div>
              {_txDetailsString.unlockTime && (
                <>
                  <p>Claimable after:</p>
                  <p className="font-semibold">
                    {_txDetailsString.unlockTime.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}
                  </p>
                </>
              )}
            </>
          ) : (
            <p>Complete the formulary to review the details of it</p>
          )}
        </div>
      </div>
    </div>
  );
};
const NewEscrowTx = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2 - Create a new Escrow Transaction</CardTitle>
        <CardDescription className="w-48 md:w-full">
          Check your token balances or mint tokens if your empty.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewEscrowTxForm />
      </CardContent>
    </Card>
  );
};

export default NewEscrowTx;
