import { ReportsPanel } from "@/components/admin/ReportsPanel";
import { listEnquiries, listStoredProperties } from "@/lib/store";

export default async function AdminReportsPage() {
  const [properties, enquiries] = await Promise.all([listStoredProperties(), listEnquiries()]);
  return <ReportsPanel properties={properties} enquiries={enquiries} />;
}
