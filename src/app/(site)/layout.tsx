import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteShell } from "@/components/layout/SiteShell";
import { FloatingLeadBar, TopBanner } from "@/components/leads/LeadActions";
import { parseTheme, THEME_KEY } from "@/lib/theme";
import { cookies } from "next/headers";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialTheme = parseTheme(cookieStore.get(THEME_KEY)?.value);
  return (
    <SiteShell initialTheme={initialTheme}>
      <TopBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingLeadBar />
    </SiteShell>
  );
}
