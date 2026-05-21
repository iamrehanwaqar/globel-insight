import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/dashboard");
  if (!isAdmin(session)) redirect("/unauthorized");
  redirect("/admin");
}
