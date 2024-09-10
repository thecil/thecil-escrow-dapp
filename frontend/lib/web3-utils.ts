export * from "viem";

// returns shorted address as '0x1223...1233'
export const shortAddress = (address: string, size?: number): string =>
  `${address.slice(0, size ? size : 5)}...${address.slice(address.length - (size ? size : 5), address.length)}`;
