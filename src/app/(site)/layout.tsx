import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingLeadBar, TopBanner } from "@/components/leads/LeadActions";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <TopBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingLeadBar />
    </div>
  );
}
