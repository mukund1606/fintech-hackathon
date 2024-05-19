import ExpensesTable from "./expensesTable";

export default function ExpensesPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-2xl font-semibold">Expenses</h1>
      <ExpensesTable />
    </div>
  );
}
