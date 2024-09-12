/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type BaseError,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt
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
import { FileSignature, Loader2 } from "lucide-react";
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

const NewEscrowTxForm = () => {
  const chainId = useChainId();

  const {
    allowanceSpender,
    tokenAddress,
    setTokenAddress,
    setTokenAllowanceSpender,
    allowance,
    balanceOfConnectedAccount,
    refetchBalanceOfConnectedAccount,
    decimals
  } = useReadToken();

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
    // try {
    // } catch (error) {
    //   console.log("onSubmit: error", { error });
    // }
  };
  // initiate read token hook when an token is selected or changed
  const _selectedToken = form.watch("tokenAddress");
  useEffect(() => {
    const _fieldState = form.getFieldState("tokenAddress");
    // validate fields
    if (_selectedToken && !_fieldState.invalid) {
      // when different token than hook is selected
      if (tokenAddress !== _selectedToken) {
        setTokenAddress(_selectedToken as Address);
        refetchBalanceOfConnectedAccount();
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
      // refetchAllowance();
      refetchBalanceOfConnectedAccount();
      // refetchUserAgreements();
      // setIsOpen(false);
    }
    // if (isConfirmedApproval) {
    //   toast.success(`Token Approve transaction success, \n Hash:${approveHash}`);
    //   refetchAllowance();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConfirmedCreateEscrowTx
    // isConfirmedApproval
  ]);

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

          <Button
            disabled={isPendingCreateEscrowTx || isConfirmingCreateEscrowTx}
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
          </Button>
        </form>
      </Form>
      <div className="grid gap-2 border rounded-md p-2">
        <p className="text-2xl font-semibold">Verify Values</p>
        <div className="flex gap-2 items-center">
          <p>Will send</p>
          <p>{form.getValues("tokenAmount")}</p>
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
