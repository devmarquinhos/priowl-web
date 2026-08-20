"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function DashboardFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Valores atuais na URL
  const currentStatus = searchParams.get("filter") || "pending";
  const currentImportance = searchParams.get("importance") || "all";
  const currentDate = searchParams.get("date") || "";

  // Conta quantos filtros estão diferentes do "padrão" para mostrar um badge
  let activeFiltersCount = 0;
  if (currentStatus !== "pending") activeFiltersCount++;
  if (currentImportance !== "all") activeFiltersCount++;
  if (currentDate !== "") activeFiltersCount++;

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Mapeia o valor padrão de cada chave
    const defaults: Record<string, string> = {
      filter: "pending",
      importance: "all",
      date: "",
    };

    // Mantém na URL se for diferente do padrão; remove se voltar ao padrão
    if (value && value !== defaults[key]) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    // Reseta tudo mantendo apenas o parâmetro de texto (q) se houver
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filter");
    params.delete("importance");
    params.delete("date");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BOTÃO DISPARADOR */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 py-2 text-xs font-bold border rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isOpen || activeFiltersCount > 0
            ? "bg-muted/50 border-border text-foreground"
            : "bg-background border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`}
      >
        <Filter size={14} />
        Filtros
        {/* Badge mostrando quantos filtros estão ativos */}
        {activeFiltersCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* MODALZINHO SUSPENSO (DROPDOWN) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-3 bg-card border border-border rounded-lg shadow-xl z-50 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold text-foreground">Filtrar Tarefas</span>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-[10px] font-semibold text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <X size={12} />
                Limpar tudo
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* 1. Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
              <select
                value={currentStatus}
                onChange={(e) => updateParams("filter", e.target.value)}
                className="h-8 px-2 py-1 text-xs bg-background border border-border rounded-md outline-none focus:border-primary w-full text-foreground cursor-pointer"
              >
                <option value="pending">Apenas Pendentes</option>
                <option value="completed">Concluídas</option>
                <option value="all">Todas as Tarefas</option>
              </select>
            </div>

            {/* 2. Importância */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Importância</label>
              <select
                value={currentImportance}
                onChange={(e) => updateParams("importance", e.target.value)}
                className="h-8 px-2 py-1 text-xs bg-background border border-border rounded-md outline-none focus:border-primary w-full text-foreground cursor-pointer"
              >
                <option value="all">Qualquer Nível</option>
                <option value="critical">Críticas (Nível 5)</option>
                <option value="pinned">Fixadas (Nível 3-4)</option>
                <option value="normal">Trabalho (Nível 1-2)</option>
              </select>
            </div>

            {/* 3. Data */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Data Alvo</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => updateParams("date", e.target.value)}
                className="h-8 px-2 py-1 text-xs bg-background border border-border rounded-md outline-none focus:border-primary w-full text-muted-foreground cursor-pointer"
              />
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}