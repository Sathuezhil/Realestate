import { AuthProvider } from "@/components/providers/AuthProvider";
import { getCurrentUser } from "@/lib/auth";
import { parseTheme, THEME_KEY } from "@/lib/theme";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aurelia Estates",
    template: "%s · Aurelia",
  },
  description:
    "Private Dubai homes — Palm Jumeirah, Downtown, Marina, and gated communities. Book a viewing today.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f6f1e8",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [user, cookieStore] = await Promise.all([getCurrentUser(), cookies()]);
  const theme = parseTheme(cookieStore.get(THEME_KEY)?.value);
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable} min-h-full antialiased${theme === "dark" ? " site-dark" : ""}`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
