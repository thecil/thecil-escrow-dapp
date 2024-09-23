"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EscrowTx, EscrowStatus } from "@/types/escrow";

import { Badge } from "@/components/ui/badge";
import { Address, formatUnits, shortAddress } from "@/lib/web3-utils";
import { sepoliaAaveReserveTokens } from "@/lib/aave-contracts";
import Image from "next/image";
import { useReadToken } from "@/hooks/web3/contracts/use-read-token";
import { useEffect } from "react";
import { unixToDateTime } from "@/lib/unix-time";
import ApproveEscrowButton from "../escrow-buttons/approve-escrow-btn";
import CancelEscrowButton from "../escrow-buttons/cancel-escrow-btn";
import DisputeEscrowButton from "../escrow-buttons/dispute-escrow-btn";
import { useAccount } from "wagmi";
import { UserCircle2 } from "lucide-react";

const EscrowActionButtons = ({ escrowTx }: { escrowTx: EscrowTx }) => {
  return (
    <div className="flex gap-2 items-center">
      <ApproveEscrowButton escrowTx={escrowTx} />
      <CancelEscrowButton escrowTx={escrowTx} />
      <DisputeEscrowButton escrowTx={escrowTx} />
    </div>
  );
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

const ConnectedParticipant = ({ account }: { account: Address }) => {
  const { address } = useAccount();
  if (address && address === account)
    return (
      <div className="flex gap-2 items-center">
        <UserCircle2 className="h-4 w-4" />
        <p>You</p>
      </div>
    );
  return <p>{shortAddress(account)}</p>;
};

export const columns: ColumnDef<EscrowTx>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={badgeVariantByStatus(row.original.status)}>
        {EscrowStatus[row.original.status]}
      </Badge>
    ),
    accessorFn: (row) => EscrowStatus[row.status]
  },
  {
    accessorKey: "initiator",
    header: "From",
    cell: ({ row }) => (
      <ConnectedParticipant account={row.original.initiator} />
    )
  },
  {
    accessorKey: "beneficiary",
    header: "To",
    cell: ({ row }) => (
      <ConnectedParticipant account={row.original.beneficiary} />
    )
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
