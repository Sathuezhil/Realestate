import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/auth";
import { listEnquiries } from "@/lib/store";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Studio" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");
  const enquiries = await listEnquiries();
  const newLeads = enquiries.filter((item) => item.status === "new").length;
  const newViewings = enquiries.filter((item) => item.status === "new" && item.source === "property").length;
  const now = new Date();
  const hour = now.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = now.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <AdminShell name={user.name} newLeads={newLeads} newViewings={newViewings} hello={hello} today={today}>
      {children}
    </AdminShell>
  );
}
