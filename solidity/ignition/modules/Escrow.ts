import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EscrowModule = buildModule("EscrowModule", (m) => {
  const escrow = m.contract("Escrow");
  return { escrow };
});

export default EscrowModule;
