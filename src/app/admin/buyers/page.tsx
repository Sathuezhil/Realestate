import { BuyersTable } from "@/components/admin/BuyersTable";
import { listStoredProperties, listUsers } from "@/lib/store";

export default async function AdminBuyersPage() {
  const [users, properties] = await Promise.all([listUsers(), listStoredProperties()]);
  return (
    <BuyersTable
      buyers={users.filter((item) => item.role === "user")}
      properties={properties}
    />
  );
}
