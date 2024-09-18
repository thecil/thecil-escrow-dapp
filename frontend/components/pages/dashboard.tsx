import { useReadEscrow } from "@/hooks/web3/contracts/use-read-escrow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewEscrowTx from "../web3/new-escrow-tx";
import Faucet from "../web3/faucet";
import EscrowTxTable from "../web3/escrow-tx-table";

const transactions = [
  {
    id: 1,
    description: "Property Purchase",
    amount: 50000,
    status: "Pending",
    date: "2023-07-01"
  },
  {
    id: 2,
    description: "Vehicle Sale",
    amount: 35000,
    status: "Completed",
    date: "2023-06-28"
  },
  {
    id: 3,
    description: "Business Acquisition",
    amount: 500000,
    status: "In Progress",
    date: "2023-06-25"
  },
  {
    id: 4,
    description: "Artwork Sale",
    amount: 12000,
    status: "Completed",
    date: "2023-06-20"
  },
  {
    id: 5,
    description: "Real Estate Development",
    amount: 1000000,
    status: "Pending",
    date: "2023-06-15"
  }
];

export default function EscrowDashboard() {
  const { contractEtherBalance } = useReadEscrow();

  const pendingEscrow = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + t.amount, 0);
  const completedEscrow = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="grid gap-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Escrow Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETH {contractEtherBalance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Escrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingEscrow.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Escrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${completedEscrow.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
      <Faucet />
      <NewEscrowTx />
      <EscrowTxTable />
    </main>
  );
}
