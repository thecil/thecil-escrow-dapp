import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import NewEscrowTx from "../new-escrow-tx";
import { useReadEscrow } from "@/hooks/contracts/use-read-escrow";
import Faucet from "../faucet";

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
  const [filter, setFilter] = useState("All");
  const { contractEtherBalance } = useReadEscrow();
  const filteredTransactions =
    filter === "All"
      ? transactions
      : transactions.filter((t) => t.status === filter);

  // const totalEscrow = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingEscrow = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + t.amount, 0);
  const completedEscrow = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="grid gap-4">
      <div className="grid grid-cols-3 gap-4">
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
      <div>
        <NewEscrowTx />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Step 3 - Manage Your Escrow Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="w-1/3">
              <Input type="text" placeholder="Search transactions..." />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
