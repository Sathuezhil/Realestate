import { PropertyForm } from "@/components/admin/PropertyForm";
import { getStoredPropertyById } from "@/lib/store";
import { notFound } from "next/navigation";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getStoredPropertyById(id);
  if (!property) notFound();
  return <PropertyForm property={property} />;
}
