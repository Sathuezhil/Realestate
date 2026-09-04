import { ViewingsBoard } from "@/components/admin/ViewingsBoard";
import { listEnquiries, listStoredProperties } from "@/lib/store";

export default async function AdminViewingsPage() {
  const [enquiries, properties] = await Promise.all([listEnquiries(), listStoredProperties()]);
  const titles = Object.fromEntries(properties.map((item) => [item.id, item.title]));
  return (
    <ViewingsBoard
      enquiries={enquiries.filter((item) => item.source === "property")}
      titles={titles}
    />
  );
}
