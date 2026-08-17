"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutGrid, 
  BarChart2, 
  Settings, 
  Wallet, 
  ClipboardList, 
  ShoppingBag, 
  HeartPulse, 
  Plus, 
  Award,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button"; // Atenção à letra minúscula se aplicável
import { UserProfileResponse } from "@/types/user";
import { getMinhaAssinaturaAction } from "@/actions/user-actions"; // Importando sua Action

interface SideBarProps {
  user: UserProfileResponse | null; 
}

export default function Sidebar({ user }: SideBarProps) {
  const pathname = usePathname();
  
  // Estado para armazenar o nome do plano
  const [planName, setPlanName] = useState<string>("Carregando...");

  // Busca o plano assim que a Sidebar é montada
  useEffect(() => {
    async function fetchPlan() {
      try {
        const subscription = await getMinhaAssinaturaAction();
        setPlanName(subscription?.planName || "Free");
      } catch (error) {
        setPlanName("Free");
      }
    }
    fetchPlan();
  }, []);

  const mainNav = [
    { name: "Painel", href: "/dashboard", icon: LayoutGrid },
    { name: "Relatórios", href: "/reports", icon: BarChart2 },
    { name: "Configurações", href: "/settings", icon: Settings },
  ];

  const categories = [
    { name: "Financeiro", count: 1, icon: Wallet },
    { name: "Tarefas", count: 8, icon: ClipboardList },
    { name: "Mercado", count: 3, icon: ShoppingBag },
    { name: "Saúde", count: 6, icon: HeartPulse },
  ];

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-border bg-card transition-colors duration-200">
      
      {/* Perfil no Topo - Altura fixa de 80px */}
      <div className="flex h-[80px] shrink-0 items-center gap-3 border-b border-border px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-white font-bold">
          {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-foreground">
              {user?.username || "Usuário"}
            </span>
          </div>
          <span className="truncate text-xs text-muted">
            {user?.email || "Carregando..."}
          </span>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="mt-4 flex flex-col gap-1">
        {mainNav.map((item) => {
          const isActive = pathname?.includes(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 border-l-4 px-6 py-3 text-sm font-medium transition-colors ${
                isActive 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted hover:bg-muted/20 hover:text-foreground"
              }`}
              style={isActive ? { backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)" } : {}}
            >
              <item.icon 
                size={20} 
                className={isActive ? "text-primary" : "text-muted"} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mx-6 my-4 border-t border-border"></div>

      {/* Categorias */}
      <div className="flex flex-1 flex-col px-6">
        <h3 className="mb-4 text-xs font-bold tracking-widest text-muted">
          CATEGORIAS
        </h3>
        
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <li key={category.name} className="flex cursor-pointer items-center justify-between group">
              <div className="flex items-center gap-3 text-sm font-medium text-muted transition-colors group-hover:text-foreground">
                <category.icon size={18} className="text-primary" />
                {category.name}
              </div>
              <span className="text-xs font-semibold text-muted">
                {category.count}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button 
            className="flex w-full items-center justify-center gap-2 border-none bg-primary text-white font-medium transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Card do Plano do Usuário */}
      <div className="p-4">
        {/* Link apontando para a página de configurações onde ele pode gerenciar a assinatura */}
        <Link href="/settings?aba=assinatura">
          <div className="flex cursor-pointer items-center justify-between rounded-md border border-border bg-muted/20 p-3 transition-colors hover:bg-muted/40">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                <Award size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase text-muted">Seu Plano</span>
                <span className="text-sm font-bold text-foreground">{planName}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </div>
        </Link>
      </div>

    </aside>
  );
}