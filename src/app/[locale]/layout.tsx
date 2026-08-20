import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { cookies } from "next/headers"; // 🔹 Importado para ler os cookies no servidor
import "../globals.css"; 

export const metadata: Metadata = {
  title: "Priowl - Gerenciador de Tarefas",
  description: "Tudo o que você precisa para gerenciar tarefas com eficiência.",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

const ACCENT_COLORS = [
  { id: "primary", name: "Ouro", hex: "#D6A628", hover: "#B98C03" },
  { id: "secondary", name: "Cobre", hex: "#B85B33", hover: "#9B451F" },
  { id: "tertiary", name: "Bege", hex: "#8C7364", hover: "#4E4635" },
  { id: "muted", name: "Cinza", hex: "#5E5E5E", hover: "#3F3F3F" },
];

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!["pt", "en"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  // O Servidor lê o cookie
  const cookieStore = await cookies();
  const savedColorId = cookieStore.get("priowl-accent")?.value || "primary";
  const activeColor = ACCENT_COLORS.find(c => c.id === savedColorId) || ACCENT_COLORS[0];

  return (
    <html 
      lang={locale} 
      suppressHydrationWarning
      style={{
        "--color-primary": activeColor.hex,
        "--color-primary-hover": activeColor.hover,
      } as React.CSSProperties}
    >
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-200">
        <NextIntlClientProvider messages={messages}>
          {/* Passamos o hex inicial como propriedade para o Provider */}
          <ThemeProvider initialColorHex={activeColor.hex}>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}