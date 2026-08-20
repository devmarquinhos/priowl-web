import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/Button";

// 1. Componente do Header
async function MarketingHeader() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("priowl_token")?.value;

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-primary">Priowl</Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/funcionalidades" className="hover:text-foreground">Funcionalidades</Link>
          <Link href="/solucoes" className="hover:text-foreground">Soluções</Link>
          <Link href="/plans" className="text-foreground font-semibold border-b-2 border-primary pb-1">Planos</Link>
          <Link href="/recursos" className="hover:text-foreground">Recursos</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Link href="/dashboard">
            <Button className="bg-primary text-white">Ir para o Painel</Button>
          </Link>
        ) : (
          <>
            {/* NOVO BOTÃO: Retorno para a Home */}
            <Link href="/">
              <Button variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">
                Início
              </Button>
            </Link>
            
            <Link href="/auth?mode=login">
              <Button variant="ghost" className="font-semibold text-primary">Fazer Login</Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button className="bg-primary text-white font-semibold">Começar gratuitamente</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

// 2. EXPORT DEFAULT DO LAYOUT
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingHeader />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}