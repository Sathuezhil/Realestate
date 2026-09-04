import { EnquiriesTable } from "@/components/admin/EnquiriesTable";
import { listEnquiries, listStoredProperties } from "@/lib/store";

export default async function AdminEnquiriesPage() {
  const [enquiries, properties] = await Promise.all([listEnquiries(), listStoredProperties()]);
  const titles = Object.fromEntries(properties.map((item) => [item.id, item.title]));
  return <EnquiriesTable enquiries={enquiries} titles={titles} />;
}
