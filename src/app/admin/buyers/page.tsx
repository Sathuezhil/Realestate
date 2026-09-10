import { BuyersTable } from "@/components/admin/BuyersTable";
import { IntakeBoard } from "@/components/admin/IntakeBoard";
import { listEnquiries, listStoredProperties, listUsers } from "@/lib/store";

export default async function AdminBuyersPage() {
  const [users, properties, enquiries] = await Promise.all([
    listUsers(),
    listStoredProperties(),
    listEnquiries(),
  ]);
  const intakes = enquiries.filter((item) => item.source === "intake");
  return (
    <div className="space-y-10">
      <section>
        <p className="text-xs uppercase tracking-[0.16em] text-gold-hover">Buyer briefs</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">How they want to live</h2>
        <p className="mt-1 mb-5 text-sm text-muted">Community, budget, beds, and timeline from the site.</p>
        <IntakeBoard intakes={intakes} />
      </section>
      <section>
        <p className="text-xs uppercase tracking-[0.16em] text-gold-hover">Accounts</p>
        <h2 className="mt-1 font-serif text-2xl text-ink">Registered buyers</h2>
        <p className="mt-1 mb-5 text-sm text-muted">Saved homes on signed-in accounts.</p>
        <BuyersTable
          buyers={users.filter((item) => item.role === "user")}
          properties={properties}
        />
      </section>
    </div>
  );
}
