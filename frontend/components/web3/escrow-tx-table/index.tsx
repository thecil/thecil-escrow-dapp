import React, { useEffect } from "react";
import { useReadEscrow } from "@/hooks/web3/contracts/use-read-escrow";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EscrowTx } from "@/types/escrow";

const EscrowTxTable = () => {
  const {
    getAllEscrowsTx,
    // refetchGetAllEscrowsTx,
    isLoadingGetAllEscrowsTx,
    getAllEscrowsTxError
  } = useReadEscrow();

  useEffect(() => {
    console.log("getAllEscrowsTx", { getAllEscrowsTx });
  }, [getAllEscrowsTx]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3 - Manage Your Escrow Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingGetAllEscrowsTx && <div>isLoadingGetAllEscrowsTx</div>}
        {getAllEscrowsTxError && <div>getAllEscrowsTxError</div>}
        {getAllEscrowsTx && (
          <DataTable columns={columns} data={getAllEscrowsTx as EscrowTx[]} />
        )}
      </CardContent>
    </Card>
  );
};

export default EscrowTxTable;
