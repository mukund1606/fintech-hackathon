"use client";
import { api } from "@/trpc/react";

import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem } from "@/components/ui/form";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";

import {
  CreateExpenseFormSchema,
  type categorySchema,
  type modeOfPaymentSchema,
  type typeOfTransactionSchema,
} from "@/types/forms";

export default function CreateStudentForm() {
  const form = useForm<z.infer<typeof CreateExpenseFormSchema>>({
    resolver: zodResolver(CreateExpenseFormSchema),
    defaultValues: {
      amount: 0,
      category: "FOOD",
      description: "",
      modeOfPayment: "CASH",
      type: "EXPENSE",
    },
  });

  const apiUtils = api.useUtils();
  const addExpenseRoute = api.expenses.createExpense.useMutation({
    async onSuccess() {
      await apiUtils.expenses.invalidate();
      form.reset();
      toast.success("Expense added successfully");
    },
    onError(e) {
      toast.error(e.message);
    },
  });

  async function submitForm(data: z.infer<typeof CreateExpenseFormSchema>) {
    await addExpenseRoute.mutateAsync(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitForm)}
        className="grid gap-4 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <Select
                label="Category"
                variant="bordered"
                size="lg"
                className="w-full"
                {...field}
                onSelectionChange={(value) => {
                  if (!value) return;
                  form.setValue(
                    "category",
                    value as z.infer<typeof categorySchema>,
                  );
                }}
                selectedKeys={[form.getValues("category")]}
                isInvalid={form.formState.errors.category !== undefined}
                errorMessage={
                  form.formState.errors.category?.message
                    ? "Invalid Category"
                    : ""
                }
              >
                <SelectItem key="FOOD" value="FOOD">
                  FOOD
                </SelectItem>
                <SelectItem key="ELECTRICITY" value="ELECTRICITY">
                  ELECTRICITY
                </SelectItem>
                <SelectItem key="TRANSPORT" value="TRANSPORT">
                  TRANSPORT
                </SelectItem>
                <SelectItem key="SUBSCRIPTION" value="SUBSCRIPTION">
                  SUBSCRIPTION
                </SelectItem>
                <SelectItem key="PROPERTY" value="PROPERTY">
                  PROPERTY
                </SelectItem>
                <SelectItem key="MEDICAL" value="MEDICAL">
                  MEDICAL
                </SelectItem>
                <SelectItem key="OTHER" value="OTHER">
                  OTHER
                </SelectItem>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modeOfPayment"
          render={({ field }) => (
            <FormItem>
              <Select
                label="Mode of Payment"
                variant="bordered"
                size="lg"
                className="w-full"
                {...field}
                onSelectionChange={(value) => {
                  if (!value) return;
                  form.setValue(
                    "modeOfPayment",
                    value as z.infer<typeof modeOfPaymentSchema>,
                  );
                }}
                selectedKeys={[form.getValues("modeOfPayment")]}
                isInvalid={form.formState.errors.modeOfPayment !== undefined}
                errorMessage={
                  form.formState.errors.modeOfPayment?.message
                    ? "Invalid Mode of Payment"
                    : ""
                }
              >
                <SelectItem key="CASH" value="CASH">
                  CASH
                </SelectItem>
                <SelectItem key="CREDIT_CARD" value="CREDIT_CARD">
                  CREDIT CARD
                </SelectItem>
                <SelectItem key="DEBIT_CARD" value="DEBIT_CARD">
                  DEBIT CARD
                </SelectItem>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Select
                label="Type"
                variant="bordered"
                size="lg"
                className="w-full"
                {...field}
                onSelectionChange={(value) => {
                  if (!value) return;
                  form.setValue(
                    "type",
                    value as z.infer<typeof typeOfTransactionSchema>,
                  );
                }}
                selectedKeys={[form.getValues("type")]}
                isInvalid={form.formState.errors.type !== undefined}
                errorMessage={
                  form.formState.errors.type?.message ? "Invalid Type" : ""
                }
              >
                <SelectItem key="EXPENSE" value="EXPENSE">
                  EXPENSE
                </SelectItem>
                <SelectItem key="INCOME" value="INCOME">
                  INCOME
                </SelectItem>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <Input
                label="Amount"
                variant="bordered"
                classNames={{
                  description: "text-sm",
                  label: "text-md font-abeezee font-bold",
                  input:
                    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                }}
                size="lg"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                inputMode="numeric"
                {...field}
                value={field.value.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(parseFloat(value));
                }}
                isInvalid={form.formState.errors.amount !== undefined}
                errorMessage={form.formState.errors.amount?.message}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Input
                label="Description"
                variant="bordered"
                classNames={{
                  description: "text-sm",
                  label: "text-md font-abeezee font-bold",
                }}
                size="lg"
                {...field}
                isInvalid={form.formState.errors.description !== undefined}
                errorMessage={form.formState.errors.description?.message}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger>
                  <span className="w-full">
                    <Input
                      label="Date of Transaction"
                      variant="bordered"
                      startContent={<CalendarIcon className="mb-1 h-5 w-5" />}
                      value={field.value ? format(field.value, "PPP") : ""}
                      isInvalid={form.formState.errors.date !== undefined}
                      classNames={{
                        label: "mb-1",
                      }}
                      errorMessage={form.formState.errors.date?.message}
                      size="lg"
                    />
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date) return;
                      if (date) {
                        field.onChange(date);
                      }
                    }}
                    toDate={new Date()}
                    initialFocus
                    fixedWeeks
                    ISOWeek
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          color="secondary"
          className="md:col-span-2"
          isLoading={addExpenseRoute.isPending}
          isDisabled={addExpenseRoute.isPending}
        >
          Create Expense
        </Button>
      </form>
    </Form>
  );
}
