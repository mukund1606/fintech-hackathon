import IncomeForm from "@/components/income";
import { api } from "@/trpc/server";
import Chart from "./chart";
import EditIncome from "./editIncome";

export default async function Home() {
  const userData = await api.user.getUserData();

  return (
    <>
      {userData.income === 0 || userData.totalBudget === 0 ? (
        <IncomeForm />
      ) : (
        <div>
          <div>
            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {userData.name}
                </p>
              </div>
              <EditIncome
                income={userData.income}
                totalBudget={userData.totalBudget}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-md border-1 p-4 shadow-md">
                <h2 className="text-xl font-semibold">Income</h2>
                <p className="text-muted-foreground">Your monthly income</p>
                <p className="text-2xl font-semibold">
                  ₹{Math.floor(userData.income * 100) / 100}
                </p>
              </div>
              <div className="rounded-md border-1 p-4 shadow-md">
                <h2 className="text-xl font-semibold">Total Budget</h2>
                <p className="text-muted-foreground">Your total budget</p>
                <p className="text-2xl font-semibold">
                  ₹{userData.totalBudget}
                </p>
              </div>
              <div className="rounded-md border-1 p-4 shadow-md">
                <h2 className="text-xl font-semibold">Savings</h2>
                <p className="text-muted-foreground">Your monthly savings</p>
                <p className="text-2xl font-semibold">
                  ₹
                  {Math.floor((userData.income - userData.totalBudget) * 100) /
                    100}
                </p>
              </div>
            </div>
          </div>
          <div>
            <Chart />
          </div>
        </div>
      )}
    </>
  );
}
