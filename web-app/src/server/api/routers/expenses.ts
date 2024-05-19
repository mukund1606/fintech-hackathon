import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { CreateExpenseFormSchema } from "@/types/forms";
import { type Category } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const expensesRouter = createTRPCRouter({
  getExpenses: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    try {
      const expenses = await ctx.db.expense.findMany({
        where: {
          userId: user.id,
        },
      });
      return expenses;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get expenses",
      });
    }
  }),
  deleteExpense: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.expense.delete({
          where: {
            id: input.id,
          },
        });
        return {
          message: "Expense deleted successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete expense",
        });
      }
    }),
  createExpense: protectedProcedure
    .input(CreateExpenseFormSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      try {
        await ctx.db.expense.create({
          data: {
            userId: user.id,
            amount: input.amount,
            category: input.category,
            date: input.date,
            isIncome: input.type === "INCOME",
            modeOfPayment: input.modeOfPayment,
            description: input.description,
          },
        });
        return {
          message: "Expense created successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create expense",
        });
      }
    }),
  getExpensesForGraph: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    try {
      const expenses = await ctx.db.expense.findMany({
        where: {
          userId: user.id,
        },
        select: {
          amount: true,
          date: true,
          isIncome: true,
        },
      });
      const expensesByDate = expenses.reduce(
        (acc: Record<string, { income: number; expense: number }>, expense) => {
          const date = expense.date.toISOString().split("T")[0];
          const today = new Date(new Date().toISOString().split("T")[0] ?? "");
          const dateObj = new Date(date ?? "");
          const diff = Math.abs(today.getTime() - dateObj.getTime());
          const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
          if (diffDays > 7) {
            return acc;
          }
          if (!acc[date ?? ""]) {
            acc[date ?? ""] = {
              income: 0,
              expense: 0,
            };
          }
          if (expense.isIncome) {
            acc[date ?? ""]!.income += expense.amount;
          } else {
            acc[date ?? ""]!.expense += expense.amount;
          }
          return acc;
        },
        {},
      );
      const finalData = Object.keys(expensesByDate)
        .map((date) => {
          return {
            date,
            income: expensesByDate[date]!.income,
            expense: expensesByDate[date]!.expense,
          };
        })
        .sort((a, b) => {
          const date1 = new Date(a.date);
          const date2 = new Date(b.date);
          return date1.getTime() - date2.getTime();
        });
      return finalData;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get expenses for graph",
      });
    }
  }),
  createMultipleExpenses: protectedProcedure
    .input(
      z.object({
        date: z.object({
          day: z.number().min(1).max(31),
          month: z.number().min(1).max(12),
          year: z.number().min(2000),
        }),
        expenses: z.array(
          z.object({
            category: z.string(),
            amount: z.number().min(1),
            description: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      try {
        const date = new Date(
          input.date.year,
          input.date.month - 1,
          input.date.day,
        );
        await ctx.db.expense.createMany({
          data: input.expenses.map((expense) => {
            let category: Category;
            if (expense.category.toLowerCase() === "food") {
              category = "FOOD";
            } else if (expense.category.toLowerCase() === "electricity") {
              category = "ELECTRICITY";
            } else if (expense.category.toLowerCase() === "transport") {
              category = "TRANSPORT";
            } else if (expense.category.toLowerCase() === "subscription") {
              category = "SUBSCRIPTION";
            } else if (expense.category.toLowerCase() === "property") {
              category = "PROPERTY";
            } else if (expense.category.toLowerCase() === "medical") {
              category = "MEDICAL";
            } else {
              category = "OTHER";
            }
            return {
              userId: user.id,
              amount: expense.amount,
              category: category,
              date,
              isIncome: false,
              modeOfPayment: "CASH",
              description: expense.description,
            };
          }),
        });
        return {
          message: "Expenses created successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create expenses",
        });
      }
    }),
});
