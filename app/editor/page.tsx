import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdmin } from "@/lib/auth";

export default async function EditorPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/editor");
  if (!isAdmin(session)) redirect("/unauthorized");
  redirect("/admin");
}
