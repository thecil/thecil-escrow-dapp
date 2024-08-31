import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { sepoliaAaveContracts } from "../../test/utils/aaveContracts";

const EscrowModule = buildModule("EscrowModule", (m) => {
  const escrow = m.contract("EscrowYieldTestnet", [
    sepoliaAaveContracts.poolAddressesProviderAave,
  ]);
  return { escrow };
});

export default EscrowModule;
