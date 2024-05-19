import { DefaultService } from "@/client";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { SetIncomeFormSchema } from "@/types/forms";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    try {
      const userData = await ctx.db.user.findFirst({
        where: {
          id: user.id,
        },
      });
      if (!userData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      return {
        ...userData,
        password: undefined,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get expenses",
      });
    }
  }),
  setIncome: protectedProcedure
    .input(SetIncomeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      try {
        await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            income: input.income,
            totalBudget: input.totalBudget,
          },
        });
        return {
          message: "Income set successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set income",
        });
      }
    }),
  predictBudget: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;
    try {
      const userData = await ctx.db.user.findFirst({
        where: {
          id: user.id,
        },
      });
      if (!userData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      const totalBudget = userData.totalBudget;
      const modelRes = await DefaultService.recomendRecomendedPost({
        income: userData.income,
        savings: userData.income - totalBudget,
      });
      const budget = [
        {
          category: "Food",
          budget: modelRes.Food,
        },
        {
          category: "Electricity",
          budget: modelRes.Electricity,
        },
        {
          category: "Transport",
          budget: modelRes.Transportation,
        },
        {
          category: "Subscription",
          budget: modelRes.Paid_services_subscription,
        },
        {
          category: "Rent",
          budget: modelRes.Rent_EMI,
        },
        {
          category: "Medical",
          budget: modelRes.Insurance,
        },
        {
          category: "Others",
          budget: modelRes.Others,
        },
      ];
      return budget;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get expenses",
      });
    }
  }),
  modifyBudget: protectedProcedure
    .input(
      z.object({
        budgetData: z.array(
          z.object({
            category: z.string(),
            budget: z.number(),
          }),
        ),
        totalBudget: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      try {
        const t2 = ctx.db.budget.upsert({
          where: {
            userId: user.id,
          },
          create: {
            electricityBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "electricity",
            )?.budget,
            foodBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "food",
            )?.budget,
            medicalBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "medical",
            )?.budget,
            propertyBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "rent",
            )?.budget,
            subscriptionBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "subscription",
            )?.budget,
            transportBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "transport",
            )?.budget,
            otherBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "others",
            )?.budget,
            userId: user.id,
          },
          update: {
            electricityBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "electricity",
            )?.budget,
            foodBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "food",
            )?.budget,
            medicalBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "medical",
            )?.budget,
            propertyBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "rent",
            )?.budget,
            subscriptionBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "subscription",
            )?.budget,
            transportBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "transport",
            )?.budget,
            otherBudget: input.budgetData.find(
              (i) => i.category.toLowerCase() === "others",
            )?.budget,
          },
        });
        const t1 = ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            totalBudget: input.totalBudget,
          },
        });
        await ctx.db.$transaction([t1, t2]);
        return {
          message: "Budget accepted successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to accept budget",
        });
      }
    }),
  getBudget: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    try {
      const userData = await ctx.db.user.findFirst({
        where: {
          id: user.id,
        },
      });
      if (!userData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }
      const budgetData = await ctx.db.budget.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (!budgetData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Budget not found",
        });
      }
      return [
        {
          category: "Food",
          budget: budgetData.foodBudget,
        },
        {
          category: "Electricity",
          budget: budgetData.electricityBudget,
        },
        {
          category: "Transport",
          budget: budgetData.transportBudget,
        },
        {
          category: "Subscription",
          budget: budgetData.subscriptionBudget,
        },
        {
          category: "Rent",
          budget: budgetData.propertyBudget,
        },
        {
          category: "Medical",
          budget: budgetData.medicalBudget,
        },
        {
          category: "Others",
          budget: budgetData.otherBudget,
        },
      ];
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get expenses",
      });
    }
  }),
});
