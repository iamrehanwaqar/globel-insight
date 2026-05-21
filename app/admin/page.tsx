import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PublishDashboard } from "@/components/admin/publish-dashboard";
import { authOptions, isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Editorial Admin",
  description: "Create, edit, schedule, and optimize Global Insight articles.",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdmin(session)) {
    redirect("/unauthorized");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">Editorial command center</p>
        <h1 className="mt-4 text-5xl font-black tracking-normal sm:text-7xl">Publish Dashboard</h1>
        <p className="mt-4 max-w-3xl text-white/58">
          Draft, preview, optimize, schedule, and manage stories. This local-first dashboard is ready to connect to Sanity write APIs or a protected database route when production credentials are available.
        </p>
      </div>
      <PublishDashboard />
    </main>
  );
}
