import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";

export default async function PublishPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/publish");
  if (!isAdmin(session)) redirect("/unauthorized");
  redirect("/admin");
}
