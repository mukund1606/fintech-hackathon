"use client";
import { api, isTRPCClientError } from "@/trpc/react";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Budgets({
  totalIncome,
  data,
}: {
  totalIncome: number;
  data: {
    category: string;
    budget: number;
  }[];
}) {
  const [budgetData, setBudgetData] = useState(data);
  const isModified = budgetData?.some(
    (budget) =>
      budget.budget !==
      data.find((b) => b.category === budget.category)?.budget,
  );

  const modifyBudgetRoute = api.user.modifyBudget.useMutation();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgetData?.map((budget, index) => (
          <div key={index} className="rounded-md border-1 p-4 shadow-md">
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
      <Button
        isDisabled={!isModified || modifyBudgetRoute.isPending}
        isLoading={modifyBudgetRoute.isPending}
        color="secondary"
        onClick={async () => {
          if (!budgetData) return;
          const totalBudget = budgetData.reduce(
            (acc, curr) => acc + curr.budget,
            0,
          );
          if (totalBudget > totalIncome) {
            toast.error("Total budget should be less than income");
            return;
          }
          try {
            const dataToSend = { budgetData: budgetData, totalBudget };
            console.log(dataToSend);
            await modifyBudgetRoute.mutateAsync(dataToSend);
            toast.success("Budget modified successfully");
          } catch (e) {
            if (isTRPCClientError(e)) {
              toast.error("Failed to modify budget");
            }
          }
        }}
        size="lg"
      >
        Modify Budget
      </Button>
    </div>
  );
}
