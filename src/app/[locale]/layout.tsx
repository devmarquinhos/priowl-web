import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import "../globals.css"; 

export const metadata: Metadata = {
  title: "Priowl - Gerenciador de Tarefas",
  description: "Tudo o que você precisa para gerenciar tarefas com eficiência.",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!["pt", "en"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}