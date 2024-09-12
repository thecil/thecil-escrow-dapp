import { z } from "zod";
import { toUnixTime } from "./unix-time";

export const tokenAmountSchema = z
  .string()
  .min(1, { message: "Enter a token amount" })
  .regex(/^\d+(\.\d+)?$/);
// .refine((value) => parseFloat(value) <= parseFloat(balanceOf), {
//   message: "Chosen amount exceeds your balance"
// })

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
  unlockTime: z
    .date({ required_error: "Unlock time is required" })
    .refine(
      (date) => date > new Date(),
      "Date must be higher than actual time."
    )
    // .transform((date) => toUnixTime(date))
});

export type NewEscrowSchemaFormInputs = z.infer<typeof newEscrowSchema>;
