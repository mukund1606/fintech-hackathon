import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid Email",
    })
    .min(1, {
      message: "Email is required",
    }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export const RegisterFormSchema = LoginFormSchema.extend({
  name: z.string().min(1, {
    message: "Name is Required",
  }),
});

export const SetIncomeFormSchema = z.object({
  income: z.number().min(1, {
    message: "Income must be a positive number",
  }),
  totalBudget: z.number().min(1, {
    message: "Total Budget must be a positive number",
  }),
});

export const categorySchema = z.enum([
  "FOOD",
  "ELECTRICITY",
  "TRANSPORT",
  "SUBSCRIPTION",
  "PROPERTY",
  "MEDICAL",
  "OTHER",
]);

export const modeOfPaymentSchema = z.enum([
  "CASH",
  "CREDIT_CARD",
  "DEBIT_CARD",
]);

export const typeOfTransactionSchema = z.enum(["EXPENSE", "INCOME"]);

export const CreateExpenseFormSchema = z.object({
  category: categorySchema,
  description: z.string().optional(),
  amount: z.number().min(1, {
    message: "Amount must be a positive number",
  }),
  date: z.coerce.date(),
  type: typeOfTransactionSchema,
  modeOfPayment: modeOfPaymentSchema,
});
