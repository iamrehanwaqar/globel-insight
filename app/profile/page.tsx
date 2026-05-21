import type { Metadata } from "next";
import { ProfileDashboard } from "@/components/user/user-actions";

export const metadata: Metadata = { title: "Profile Dashboard" };

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Reader intelligence</p>
      <h1 className="mt-4 text-5xl font-black sm:text-7xl">Profile Dashboard</h1>
      <div className="mt-8">
        <ProfileDashboard />
      </div>
    </main>
  );
}
