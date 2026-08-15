"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  BarChart2, 
  Settings, 
  Landmark, 
  Wallet, 
  ClipboardList, 
  ShoppingBag, 
  HeartPulse, 
  Plus, 
  Award,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button"; 
import { UserProfileResponse } from "@/types/user"; // 1. Importe a tipagem aqui

interface SideBarProps {
  user: UserProfileResponse | null; 
}

export default function Sidebar({ user }: SideBarProps) {
  const pathname = usePathname();
  const brandColor = "#8A6D3B"; 

  const mainNav = [
    { name: "Painel", href: "/dashboard", icon: LayoutGrid },
    { name: "Relatórios", href: "/relatorios", icon: BarChart2 },
    { name: "Configurações", href: "/configuracoes", icon: Settings },
  ];

  const categories = [
    { name: "Financeiro", count: 1, icon: Wallet },
    { name: "Tarefas", count: 8, icon: ClipboardList },
    { name: "Mercado", count: 3, icon: ShoppingBag },
    { name: "Saúde", count: 6, icon: HeartPulse },
  ];

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-gray-200 bg-[#FCFCFC]">
      
      {/* 1. Área do Usuário (Topo) */}
      <div className="flex items-center gap-3 border-b border-gray-100 p-6">
        <div 
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white"
          style={{ backgroundColor: brandColor }}
        >
          {/* Exibe a inicial do nome ou ícone */}
          <span className="font-bold">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
        <div className="flex flex-col overflow-hidden">
          {/* Dados dinâmicos aqui */}
          <span className="truncate text-sm font-bold text-gray-900">
            {user?.username || "Usuário"}
          </span>
          <span className="truncate text-xs text-gray-500">
            {user?.email || "Carregando..."}
          </span>
        </div>
      </div>

      {/* 2. Menu Principal */}
      <nav className="mt-4 flex flex-col gap-1">
        {mainNav.map((item) => {
          // Verifica se a rota atual começa com o href do item para marcá-lo como ativo
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive 
                  ? "border-l-4 bg-[#F4EFE6] text-gray-900" 
                  : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={{ borderLeftColor: isActive ? brandColor : "transparent" }}
            >
              <item.icon 
                size={20} 
                className={isActive ? "text-gray-900" : "text-gray-400"} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mx-6 my-4 border-t border-gray-100"></div>

      {/* 3. Categorias */}
      <div className="flex flex-1 flex-col px-6">
        <h3 className="mb-4 text-xs font-bold tracking-widest text-gray-400">
          CATEGORIAS
        </h3>
        
        <ul className="flex flex-col gap-3">
          {categories.map((category) => (
            <li key={category.name} className="flex cursor-pointer items-center justify-between group">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900">
                <category.icon size={18} style={{ color: brandColor }} />
                {category.name}
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {category.count}
              </span>
            </li>
          ))}
        </ul>

        {/* Botão de Nova Categoria */}
        <div className="mt-6">
          <Button 
            className="flex w-full items-center justify-center gap-2 border-none font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: brandColor }}
            // onClick={() => openModalNovaCategoria()} <-- Integração futura com o NovaCategoriaModal.tsx
          >
            <Plus size={16} />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* 4. Rodapé (Nível VIP) */}
      <div className="p-4">
        <div className="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-[#F8F6F1] p-3 transition-colors hover:bg-[#F3EFE6]">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-8 w-8 items-center justify-center rounded bg-[#F4EFE6]"
              style={{ color: brandColor }}
            >
              <Award size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase text-gray-500">Seu Nível</span>
              <span className="text-sm font-bold text-gray-900">VIP Ouro</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>

    </aside>
  );
}