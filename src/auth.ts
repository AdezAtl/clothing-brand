import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/db/store";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Tullipio Staff Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@tullipio.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        try {
          const user = await findUserByEmail(email);

          if (user) {
            const isPasswordValid = await bcrypt.compare(
              password,
              user.passwordHash
            );
            if (!isPasswordValid) return null;

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } catch (err) {
          console.warn("DB auth lookup error:", err);
        }

        // Only allow hardcoded seed credentials outside production or when explicitly enabled
        if (
          process.env.NODE_ENV !== "production" &&
          email === "admin@tullipio.com" &&
          password === "AdminTullipio2026!"
        ) {
          return {
            id: "00000000-0000-4000-8000-000000000001",
            name: "Tullipio Head Designer",
            email: "admin@tullipio.com",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role || "customer";
        token.loginTimestamp = Date.now();
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token.id as string) || (token.sub as string);
        (session.user as any).role = (token.role as string) || "customer";
        (session.user as any).loginTimestamp = token.loginTimestamp as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret:
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "f6c8d4a9e2b1049281745a30e8c71954d32a10b8e7c654d3210987654321abcd"
      : undefined),
});
