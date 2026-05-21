import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserRole = "admin" | "user";

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "admin@globalinsight.com";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "development-global-insight-secret-change-me",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (email === getAdminEmail().toLowerCase() && password === getAdminPassword()) {
          return {
            id: "global-insight-admin",
            name: "Global Insight Admin",
            email,
            role: "admin" satisfies UserRole,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role === "admin" ? "admin" : "user";
      }
      return session;
    },
  },
};

export function isAdmin(session: { user?: { role?: UserRole } } | null) {
  return session?.user?.role === "admin";
}
