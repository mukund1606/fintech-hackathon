"use client";
import { api } from "@/trpc/react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Chart() {
  const { data } = api.user.getBudget.useQuery();
  const { data: data2 } = api.expenses.getExpensesForGraph.useQuery();
  const colors = [
    "#9b5fe0",
    "#16a4d8",
    "#8bd346",
    "#efdf48",
    "#60dbe8",
    "#d64e12",
    "#f9a52c",
  ];

  return (
    <div className="flex flex-col xl:flex-row">
      <div className="w-full xl:w-[35%]">
        <ResponsiveContainer width="100%" aspect={1} minHeight={0}>
          <PieChart>
            <Pie data={data} dataKey="budget" nameKey="category">
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-auto w-full xl:w-[64%]">
        <ResponsiveContainer width="99%" aspect={2} minHeight={0}>
          <LineChart
            width={730}
            height={250}
            data={data2}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#8bd346"
              name="Income"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#d64e12"
              name="Expense"
              strokeWidth={3}
            />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
