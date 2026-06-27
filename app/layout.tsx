import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Priowl - Prioritize your tasks.",
  description: "Todo App with Data Analysis and Priority Sort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${dmSans.className} antialiased}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
