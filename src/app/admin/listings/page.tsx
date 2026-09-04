import { ListingsTable } from "@/components/admin/ListingsTable";
import { listStoredProperties } from "@/lib/store";

export default async function AdminListingsPage() {
  const properties = await listStoredProperties();
  return <ListingsTable properties={properties} />;
}
