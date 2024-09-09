import type { Address } from "viem";

interface AaveContracts {
  poolAddressesProviderAave: Address;
  wrappedTokenGatewayV3: Address;
  poolAddress: Address;
  walletBalanceProvider: Address;
  faucet: Address;
}

interface AaveReserveTokens {
  dai: Address;
  link: Address;
  usdc: Address;
  wbtc: Address;
  weth: Address;
  usdt: Address;
  aave: Address;
}

// sepolia aave contracts
export const sepoliaAaveContracts: AaveContracts = {
  poolAddressesProviderAave: "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A",
  wrappedTokenGatewayV3: "0x387d311e47e80b498169e6fb51d3193167d89F7D",
  poolAddress: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
  walletBalanceProvider: "0xCD4e0d6D2b1252E2A709B8aE97DBA31164C5a709",
  faucet: "0xC959483DBa39aa9E78757139af0e9a2EDEb3f42D"
};

// sepolia aave reserve tokens
export const sepoliaAaveReserveTokens: AaveReserveTokens = {
  dai: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
  link: "0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5",
  usdc: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
  wbtc: "0x29f2D40B0605204364af54EC677bD022dA425d03",
  weth: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c",
  usdt: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
  aave: "0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a"
};

// sepolia aave atokens
export const sepoliaAaveAtokens: AaveReserveTokens = {
  dai: "0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8",
  link: "0x3FfAf50D4F4E96eB78f2407c090b72e86eCaed24",
  usdc: "0x16dA4541aD1807f4443d92D26044C1147406EB80",
  wbtc: "0x1804Bf30507dc2EB3bDEbbbdd859991EAeF6EefF",
  weth: "0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830",
  usdt: "0xAF0F6e8b0Dc5c913bbF4d14c22B4E78Dd14310B6",
  aave: "0x6b8558764d3b7572136F17174Cb9aB1DDc7E1259"
};
