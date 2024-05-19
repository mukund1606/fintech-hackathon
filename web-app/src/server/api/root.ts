import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { register } from "./routers/register";

import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { expensesRouter } from "./routers/expenses";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  register,
  expenses: expensesRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type AppRouterOutputTypes = inferRouterOutputs<AppRouter>;
export type AppRouterInputTypes = inferRouterInputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
