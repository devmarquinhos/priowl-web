import Link from "next/link";
import { getUserProfile } from "@/services/user";
import { TabPerfil } from "./_components/TabPerfil";
import { TabAparencia } from "./_components/TabAparencia";
import { TabAssinatura } from "./_components/TabAssinatura";
import { TabSuporte } from "./_components/TabSuporte";

export default async function ConfiguracoesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ aba?: string }>;
}>) {
  const user = await getUserProfile();
  const fallback = user?.username ? user.username.substring(0, 2).toUpperCase() : "US";

  const params = await searchParams;
  const abaAtual = params.aba || "perfil";

  const tabs = [
    { id: "perfil", label: "Meu Perfil" },
    { id: "aparencia", label: "Aparência" },
    { id: "assinatura", label: "Assinatura e Planos" },
    { id: "suporte", label: "Suporte e Contato" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      
      {/* 1. Abas de Navegação (Tabs) */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = abaAtual === tab.id;
            return (
              <Link
                key={tab.id}
                href={`?aba=${tab.id}`}
                className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:border-border hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {abaAtual === "perfil" && <TabPerfil user={user} fallback={fallback} />}
      {abaAtual === "aparencia" && <TabAparencia />}
      {abaAtual === "assinatura" && <TabAssinatura />}
      {abaAtual === "suporte" && <TabSuporte />}

    </div>
  );
}