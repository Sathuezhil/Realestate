import { SettingsForm } from "@/components/admin/SettingsForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/settings");
  return <SettingsForm name={user.name} email={user.email} />;
}
