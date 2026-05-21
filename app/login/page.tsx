import type { Metadata } from "next";
import { LoginPanel } from "@/components/user/user-actions";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_420px]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Admin access</p>
        <h1 className="mt-4 text-5xl font-black sm:text-7xl">Open the newsroom dashboard.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/58">
          Sign in securely, keep the session after refresh, and unlock publishing tools only for admin users.
        </p>
      </div>
      <LoginPanel />
    </main>
  );
}
