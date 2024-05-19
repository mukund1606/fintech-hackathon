import { api } from "@/trpc/server";
import Budgets from "./Budgets";

export default async function BudgetsPage() {
  const userData = await api.user.getUserData();
  const budgetData = await api.user.getBudget();
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">Budgets</h1>
      <Budgets data={budgetData} totalIncome={userData.income} />
    </div>
  );
}
