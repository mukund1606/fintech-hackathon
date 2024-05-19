"use client";
import { api, isTRPCClientError } from "@/trpc/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { toast } from "sonner";

import { Form, FormField, FormItem } from "@/components/ui/form";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import { SetIncomeFormSchema } from "@/types/forms";
import { useState } from "react";

export default function IncomeForm({
  income = 0,
  totalBudget = 0,
}: {
  income?: number;
  totalBudget?: number;
}) {
  const [showPopup, setShowPopup] = useState(false);

  const [budgetData, setBudgetData] = useState<
    {
      category: string;
      budget: number;
    }[]
  >();

  const form = useForm<z.infer<typeof SetIncomeFormSchema>>({
    resolver: zodResolver(SetIncomeFormSchema),
    defaultValues: {
      income: income ?? 0,
      totalBudget: totalBudget ?? 0,
    },
  });

  const apiUtils = api.useUtils();
  const setIncomeRoute = api.user.setIncome.useMutation({
    async onSuccess() {
      await apiUtils.user.invalidate();
      setShowPopup(true);
    },
  });

  const acceptBudgetRoute = api.user.modifyBudget.useMutation({
    async onSuccess() {
      await apiUtils.user.invalidate();
      setShowPopup(false);
      window.location.reload();
    },
  });

  const recommendedBudgetRoute = api.user.predictBudget.useMutation();

  async function submitForm(data: z.infer<typeof SetIncomeFormSchema>) {
    try {
      if (data.income < data.totalBudget) {
        toast.error("Income should be greater than total budget");
        return;
      }
      const res = await setIncomeRoute.mutateAsync(data);
      toast.success(res.message);
      const recData = await recommendedBudgetRoute.mutateAsync();
      setBudgetData(recData);
    } catch (e) {
      if (isTRPCClientError(e)) {
        toast.error(e.message);
      }
    }
  }

  return (
    <>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className="flex w-full flex-col gap-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      label="Income"
                      variant="bordered"
                      description="This is your monthly income including salary."
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
                      isInvalid={form.formState.errors.income !== undefined}
                      errorMessage={form.formState.errors.income?.message}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalBudget"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      label="Total Budget"
                      description="This is the total budget you want to set for the month."
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
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(parseFloat(value));
                      }}
                      value={field.value.toString()}
                      isInvalid={
                        form.formState.errors.totalBudget !== undefined
                      }
                      errorMessage={form.formState.errors.totalBudget?.message}
                    />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              color="secondary"
              className="w-full"
              isLoading={setIncomeRoute.isPending}
              isDisabled={setIncomeRoute.isPending}
            >
              Set Income
            </Button>
          </form>
        </Form>
      </div>
      {showPopup && (
        <Modal
          isOpen
          onOpenChange={setShowPopup}
          size="5xl"
          className="max-h-[90%] overflow-y-auto"
        >
          <ModalContent>
            <ModalHeader>
              <h1 className="text-2xl font-semibold">Recommended Budgets</h1>
            </ModalHeader>
            <ModalBody>
              <div className="grid gap-4 lg:grid-cols-3">
                {budgetData?.map((budget, index) => (
                  <div
                    key={index}
                    className="rounded-md border-1 p-4 shadow-md"
                  >
                    <h2 className="text-xl font-semibold">{budget.category}</h2>
                    <Input
                      label="Budget"
                      variant="bordered"
                      description="This is the recommended budget for this category."
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
                      onChange={(e) => {
                        const value = e.target.value;
                        setBudgetData((prev) => {
                          if (!prev) return prev;
                          return prev.map((b) => {
                            if (b.category === budget.category) {
                              return {
                                ...b,
                                budget: parseFloat(value),
                              };
                            }
                            return b;
                          });
                        });
                      }}
                      value={(Math.round(budget.budget * 100) / 100).toString()}
                    />
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                isDisabled={acceptBudgetRoute.isPending || !budgetData}
                isLoading={acceptBudgetRoute.isPending || !budgetData}
                color="secondary"
                onClick={async () => {
                  if (!budgetData) return;
                  const totalBudget = budgetData.reduce(
                    (acc, curr) => acc + curr.budget,
                    0,
                  );
                  if (totalBudget > form.getValues("income")) {
                    toast.error("Total budget should be less than income");
                    return;
                  }
                  try {
                    const dataToSend = { budgetData: budgetData, totalBudget };
                    console.log(dataToSend);
                    await acceptBudgetRoute.mutateAsync(dataToSend);
                    toast.success("Budget accepted successfully");
                  } catch (e) {
                    if (isTRPCClientError(e)) {
                      toast.error(e.message);
                    }
                  }
                }}
                size="lg"
              >
                Accept Budget
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
