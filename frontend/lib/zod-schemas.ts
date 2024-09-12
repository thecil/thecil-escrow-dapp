import { z } from "zod";
import { toUnixTime } from "./unix-time";

export const tokenAmountSchema = z.bigint().min(1n);
export const EvmAddressSchema = z.string().refine(
  (value) =>
    // address = 42 chars
    value.startsWith("0x") && value.length === 42,
  {
    message: "Ethereum address should be of length 42.",
  }
);

export const newEscrowSchema = z.object({
  beneficiary: EvmAddressSchema,
  tokenAddress: EvmAddressSchema,
  tokenAmount: tokenAmountSchema,
  unlockTime: z
    .date({ required_error: "Unlock time is required" })
    .refine((value) => toUnixTime(value)),
});

export type NewEscrowSchemaFormInputs = z.infer<typeof newEscrowSchema>;
