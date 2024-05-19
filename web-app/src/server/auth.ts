import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import { env } from "@/env";
import { clientDecryption, comparePassword, serverDecrypt } from "@/lib/utils";
import { db } from "@/server/db";
import { LoginFormSchema } from "@/types/forms";
import Credentials from "next-auth/providers/credentials";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }

  interface User {
    name: string;
    email: string;
    image?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          LoginFormSchema.parse(credentials);
        } catch (e) {
          throw new Error("Invalid credentials");
        }
        const data = LoginFormSchema.parse(credentials);
        const user = await db.user.findUnique({
          where: { email: data.email },
        });
        if (!user) {
          throw new Error("Email not found");
        }
        const pass = serverDecrypt(user.password);
        const clientPass = clientDecryption(data.password);
        if (comparePassword(clientPass, pass)) {
          return { id: user.id, name: user.name, email: user.email };
        } else {
          throw new Error("Invalid password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/login",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        return Promise.resolve({ ...user });
      } else {
        return Promise.resolve(token);
      }
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
