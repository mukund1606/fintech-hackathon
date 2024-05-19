import { clientDecryption, hashPassword } from "@/lib/utils";
import { publicProcedure } from "@/server/api/trpc";
import { RegisterFormSchema } from "@/types/forms";
import { TRPCError } from "@trpc/server";

export const register = publicProcedure
  .input(RegisterFormSchema)
  .mutation(async ({ ctx, input }) => {
    const password = clientDecryption(input.password);
    const { encryptedPassword } = hashPassword(password);
    try {
      await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: encryptedPassword,
          budget: {
            create: {},
          },
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User already exists",
      });
    }
  });
