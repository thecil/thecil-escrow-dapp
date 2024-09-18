"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EscrowTx, EscrowStatus } from "@/types/escrow";

import { Badge } from "@/components/ui/badge";
import { Address, formatUnits, shortAddress } from "@/lib/web3-utils";
import { sepoliaAaveReserveTokens } from "@/lib/aave-contracts";
import Image from "next/image";
import { useReadToken } from "@/hooks/web3/contracts/use-read-token";
import { useEffect } from "react";
import { unixNow, unixToDateTime } from "@/lib/unix-time";
import { Button } from "@/components/ui/button";

const EscrowActionButtons = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  const _isClaimable = escrowTx.unlockTime < BigInt(unixNow());
  if (escrowTx.status !== 1 && escrowTx.status !== 2) {
    return (
      <div className="flex gap-2 items-center">
        {escrowTx.status === 0 && _isClaimable && <Button size="sm">Approve</Button>}
        <Button size="sm" variant="destructive">Cancel</Button>
        <Button size="sm" variant="outline">Dispute</Button>
      </div>
    );
  }
  return null;
};

const TokenAmount = ({
  tokenAddr,
  tokenAmount
}: {
  tokenAddr: Address;
  tokenAmount: bigint;
}) => {
  const { tokenAddress, setTokenAddress, decimals } = useReadToken();
  useEffect(() => {
    if (!tokenAddress || !decimals) setTokenAddress(tokenAddr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, decimals]);

  if (decimals)
    return <p>{parseFloat(formatUnits(tokenAmount, decimals)).toFixed(2)}</p>;
  return <p>{tokenAmount}</p>;
};
const badgeVariantByStatus = (_status: number) => {
  switch (_status) {
    case 0:
      return "secondary";
    case 1:
      return "success";
    case 2:
      return "destructive";
    case 3:
      return "warning";
  }
};
export const columns: ColumnDef<EscrowTx>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={badgeVariantByStatus(row.original.status)}>
        {EscrowStatus[row.original.status]}
      </Badge>
    )
  },
  {
    accessorKey: "beneficiary",
    header: "Beneficiary",
    cell: ({ row }) => <p>{shortAddress(row.original.beneficiary)}</p>
  },
  {
    accessorKey: "tokenAddr",
    header: "Token",
    cell: ({ row }) => {
      const _token = sepoliaAaveReserveTokens.find(
        (token) => token.address === row.original.tokenAddr
      );
      if (_token)
        return (
          <div className="flex gap-2 items-center">
            <Image
              src={_token.img}
              width={100}
              height={100}
              className="w-5 h-5"
              alt="token-logo"
            />
            <p>{_token.name}</p>
          </div>
        );
      if (!_token) return shortAddress(row.original.tokenAddr);
    }
  },
  {
    accessorKey: "tokenAmount",
    header: "Amount",
    cell: ({ row }) => (
      <TokenAmount
        tokenAddr={row.original.tokenAddr}
        tokenAmount={row.original.tokenAmount}
      />
    )
  },
  {
    accessorKey: "unlockTime",
    header: "Unlock Time",
    cell: ({ row }) => {
      const _unlockTime = unixToDateTime(Number(row.original.unlockTime));
      return <p>{_unlockTime?.toLocaleDateString()}</p>;
    }
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return <EscrowActionButtons escrowTx={row.original} />;
    }
  }
];
