"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { 
  LayoutGrid, 
  BarChart2, 
  Settings, 
  Award,
  ChevronRight
} from "lucide-react";
import { UserProfileResponse } from "@/types/user";
import { getMinhaAssinaturaAction } from "@/actions/user-actions";
import { getMinhasCategoriasAction } from "@/actions/category-actions"; 
import { getTasksAction } from "@/actions/task-actions"; // 🔹 Importando a ação das tarefas
import SidebarCategories from "@/components/layout/SidebarCategories"; 

interface SideBarProps {
  readonly user: UserProfileResponse | null; 
}

export interface CategoryResponse {
  id: number;
  title: string;
  color?: string; 
  taskCount?: number; 
  userId?: number | null; 
}

export default function Sidebar({ user }: SideBarProps) {
  const pathname = usePathname();
  
  const [planName, setPlanName] = useState<string>("Carregando...");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const fetchSidebarData = useCallback(async () => {
    try {
      // 🔹 Busca assinatura, categorias e TAREFAS paralelamente
      const [subscription, fetchedCategories, fetchedTasks] = await Promise.all([
        getMinhaAssinaturaAction(),
        getMinhasCategoriasAction(),
        getTasksAction()
      ]);
      
      const taskList = fetchedTasks || [];
      
      // 🔹 Cruza os dados: Conta tarefas ATIVAS para cada categoria
      const categoriesWithCount = (fetchedCategories || []).map(cat => {
        const activeTasksCount = taskList.filter(
          t => t.categoryId === cat.id && t.status !== "COMPLETED" && t.status !== "CANCELLED"
        ).length;
        
        return {
          ...cat,
          taskCount: activeTasksCount
        };
      });

      setPlanName(subscription?.planName || "Free");
      setCategories(categoriesWithCount);
    } catch (error) {
      console.error("Erro ao carregar dados da sidebar:", error);
      setPlanName("Free");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSidebarData();
    const handleUpdate = () => {
      fetchSidebarData();
    };
    window.addEventListener("tasks-updated", handleUpdate);

    return () => window.removeEventListener("tasks-updated", handleUpdate);
  }, [fetchSidebarData]);

  const mainNav = [
    { name: "Painel", href: "/dashboard", icon: LayoutGrid },
    { name: "Relatórios", href: "/reports", icon: BarChart2 },
    { name: "Configurações", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-border bg-card transition-colors duration-200">
      
      {/* Perfil no Topo */}
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

      {/* Categorias Dinâmicas */}
      <SidebarCategories 
        categories={categories} 
        onRefresh={fetchSidebarData} 
      />

      {/* Card do Plano do Usuário */}
      <div className="p-4 mt-auto border-t border-border">
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