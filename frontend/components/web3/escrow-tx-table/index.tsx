import React, { useMemo } from "react";
import { useReadEscrow } from "@/hooks/web3/contracts/use-read-escrow";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EscrowTx } from "@/types/escrow";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { FileSliders } from "lucide-react";

const EscrowTxTable = () => {
  const {
    getAllEscrowsTx,
    refetchGetAllEscrowsTx,
    isLoadingGetAllEscrowsTx,
    getAllEscrowsTxError
  } = useReadEscrow();
  const { address } = useAccount();

  const _userEscrows = useMemo(() => {
    if (!getAllEscrowsTx) return undefined;
    const _escrows = getAllEscrowsTx.filter(
      (escrowTx) =>
        escrowTx.initiator === address || escrowTx.beneficiary === address
    );
    return _escrows;
  }, [getAllEscrowsTx, address]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {" "}
          <div className="flex gap-2 items-center">
            <FileSliders className="h-6 w-6" />
            <p>Step 3 - Manage Your Escrow Transactions</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {getAllEscrowsTxError && (
          <div className="grid gap-4 justify-items-center">
            <p className="text-2xl">
              Something went wrong fetching the escrow transactions
            </p>
            <Button onMouseDown={() => refetchGetAllEscrowsTx()}>Retry</Button>
          </div>
        )}
        {isLoadingGetAllEscrowsTx && (
          <div className="animate-pulse flex w-full">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-12 bg-slate-700 rounded"></div>
              <div className="h-12 bg-slate-700 rounded"></div>
            </div>
          </div>
        )}
        {_userEscrows && (
          <DataTable columns={columns} data={_userEscrows as EscrowTx[]} />
        )}
      </CardContent>
    </Card>
  );
};

export default EscrowTxTable;
