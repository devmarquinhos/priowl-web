"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Zap, Maximize2, X, FolderTree } from "lucide-react";

export interface CategoryStat {
  readonly id: number | string;
  readonly title: string;
  readonly total: number;
  readonly completed: number;
  readonly progress: number;
  readonly pending: number;
}

export function CategoryProgressCards({ stats }: { readonly stats: CategoryStat[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isModalOpen]);

  const barColors = ['bg-primary', 'bg-orange-400', 'bg-blue-400', 'bg-amber-600'];

  return (
    <>
      <div className="flex flex-col gap-2">
        
        {/* ================= CARD ÚNICO DE RESUMO ================= */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm flex flex-col justify-center min-h-[100px] relative group">
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 text-foreground">
              <FolderTree size={14} className="text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider">
                Progresso por Categoria
              </h3>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              title="Expandir Detalhes"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {stats.length > 0 ? (
            <div className="relative overflow-hidden w-full flex items-center">
              
              {/* Linha de Mini-Cards */}
              <div className="flex gap-2 w-full pr-12 overflow-hidden">
                {stats.map((cat, index) => (
                  <div key={cat.id} className="flex flex-col gap-1.5 min-w-[100px] max-w-[120px] bg-muted/30 p-2.5 rounded-md border border-border/50 shrink-0">
                    <span className="text-[10px] font-bold truncate text-foreground">
                      {cat.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${barColors[index % barColors.length]}`} 
                          style={{ width: `${cat.progress}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground">
                        {cat.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 🔹 Máscara de Esmaecimento à direita (Fade-out) */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="flex items-center justify-center py-2 opacity-50 grayscale">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Nenhuma tarefa categorizada
              </p>
            </div>
          )}
        </div>

        {/* ================= CARD DE INSIGHTS MANTIDO ================= */}
        <div className="rounded-lg bg-primary text-primary-foreground p-4 shadow-md flex gap-3 mt-auto">
          <div className="mt-0.5">
            <Zap size={18} className="fill-white" />
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-90 mb-0.5">
              Insights de Eficiência
            </h4>
            <p className="text-xs font-medium leading-tight">
              Equipe <span className="font-extrabold underline decoration-white/50">15% mais rápida</span> este mês.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODAL DE DETALHES ================= */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative w-full max-w-2xl bg-card border border-border/50 rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-muted/10 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">Desempenho Detalhado</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Visão completa por categorias e orfãs</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-card border border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Corpo do Modal (Scrollável) */}
            <div className="p-5 overflow-y-auto space-y-3">
              {stats.map((cat, index) => (
                <div key={cat.id} className="rounded-lg border border-border bg-card p-4 shadow-sm flex flex-col justify-center gap-3">
                  
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      {cat.title}
                    </h3>
                    <span className="text-xl font-extrabold text-primary leading-none">
                      {cat.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${barColors[index % barColors.length]}`} 
                      style={{ width: `${cat.progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                      {cat.completed} de {cat.total} tarefas concluídas
                    </p>
                    <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-md text-foreground">
                      {cat.pending} Pendentes
                    </span>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}