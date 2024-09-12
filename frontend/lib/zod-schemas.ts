import { z } from "zod";

export const tokenAmountSchema = z.bigint().min(1n);
export const EvmAddressSchema = z.string().refine(
  (value) =>
    // address = 42 chars
    value.startsWith("0x") && value.length === 42,
  {
    message: "Ethereum address should be of length 42."
  }
);

export const newEscrowSchema = z.object({
  beneficiary: EvmAddressSchema,
  tokenAddress: EvmAddressSchema,
  tokenAmount: tokenAmountSchema,
  unlockTime: z.bigint().min(0n)
});

export type NewEscrowSchemaFormInputs = z.infer<typeof newEscrowSchema>;
