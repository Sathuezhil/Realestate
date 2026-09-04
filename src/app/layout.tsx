import { AuthProvider } from "@/components/providers/AuthProvider";
import { getCurrentUser } from "@/lib/auth";
import type { Metadata } from "next";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} min-h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
