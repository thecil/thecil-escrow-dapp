import NewEscrowTx from "../web3/new-escrow-tx";
import Faucet from "../web3/faucet";
import EscrowTxTable from "../web3/escrow-tx-table";
import EscrowDetails from "../web3/escrow-details";

export default function EscrowDashboard() {
  return (
    <main className="grid gap-4">
      <EscrowDetails />
      <Faucet />
      <NewEscrowTx />
      <EscrowTxTable />
    </main>
  );
}
