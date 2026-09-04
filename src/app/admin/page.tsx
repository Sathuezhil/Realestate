import { DashboardClient } from "@/components/admin/DashboardClient";
import { listEnquiries, listStoredProperties, listUsers } from "@/lib/store";

export default async function AdminHomePage() {
  const [properties, enquiries, users] = await Promise.all([
    listStoredProperties(),
    listEnquiries(),
    listUsers(),
  ]);

  return (
    <DashboardClient
      stats={{
        listings: properties.length,
        available: properties.filter((item) => item.status === "available").length,
        sold: properties.filter((item) => item.status === "sold").length,
        rented: properties.filter((item) => item.status === "rented").length,
        enquiries: enquiries.length,
        newEnquiries: enquiries.filter((item) => item.status === "new").length,
        users: users.filter((item) => item.role === "user").length,
      }}
      recentEnquiries={enquiries.slice(0, 6)}
      recentListings={properties.slice(0, 5)}
    />
  );
}
