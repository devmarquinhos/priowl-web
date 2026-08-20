"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, PenTool, Code, AlertTriangle, CheckCircle2, Users, Maximize2, X } from "lucide-react";
import type { TaskResponse } from "@/actions/task-actions";

export interface DependencyChain {
  readonly id: string | number;
  readonly bottleneck: TaskResponse;
  readonly parent: TaskResponse | null | undefined;
  readonly blockedCount: number;
}

export interface DependencyMapProps {
  readonly chains: DependencyChain[];
}

// 🔹 Subcomponente para não repetirmos o código visual gigantesco 2 vezes (na tela e no modal)
function ChainVisualizer({ chain, isLast }: { readonly chain: DependencyChain, readonly isLast?: boolean }) {
  return (
    <div className="relative">
      {/* === VISOR DO FLUXO === */}
      <div className="bg-muted/30 rounded-lg p-6 md:p-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 relative overflow-hidden mb-5">
        <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-border -translate-y-[20px] z-0"></div>

        <div className="relative z-10 flex flex-col items-center flex-1 w-full md:w-auto">
          <div className="w-16 h-16 bg-card rounded-xl shadow-md border border-[#8A6D3B] flex items-center justify-center mb-3 text-[#8A6D3B]">
            <FileText size={24} />
          </div>
          <span className="font-bold text-foreground text-xs mb-1 text-center truncate max-w-[120px]">
            {chain.parent ? chain.parent.title : "Tarefa Base"}
          </span>
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">OK</span>
        </div>

        <div className="relative z-10 flex flex-col items-center flex-1 w-full md:w-auto">
          <div className="w-20 h-20 bg-card rounded-xl shadow-xl border-2 border-red-400 flex items-center justify-center mb-3 text-red-500 scale-110">
            <PenTool size={28} />
          </div>
          <span className="font-bold text-foreground text-xs mb-1 text-center truncate max-w-[140px]">
            {chain.bottleneck.title}
          </span>
          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Bloqueado</span>
        </div>

        <div className="relative z-10 flex flex-col items-center flex-1 w-full md:w-auto opacity-60">
          <div className="w-16 h-16 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center mb-3 text-muted-foreground">
            <Code size={24} />
          </div>
          <span className="font-bold text-foreground text-xs mb-1 text-center truncate max-w-[120px]">
            {chain.blockedCount > 1 ? `${chain.blockedCount} Subsequentes` : "Subsequente"}
          </span>
          <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Aguardando</span>
        </div>
      </div>

      {/* === ALERTAS DA CADEIA === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-red-600 mb-1.5">
            <AlertTriangle size={14} />
            <h4 className="text-[10px] font-bold uppercase tracking-wider">Gargalo Identificado</h4>
          </div>
          <p className="text-xs text-red-600/80 leading-relaxed font-medium">
            A etapa &quot;{chain.bottleneck.title}&quot; está retendo {chain.blockedCount} tarefas subsequentes.
          </p>
        </div>

        <div className="bg-muted/30 border border-border p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-foreground mb-1.5">
            <CheckCircle2 size={14} className="text-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider">Status do Fluxo</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            A etapa base está ok, mas a esteira encontra-se paralisada na etapa atual.
          </p>
        </div>

        <div className="bg-muted/30 border border-border p-3 rounded-lg">
          <div className="flex items-center gap-1.5 text-foreground mb-1.5">
            <Users size={14} className="text-blue-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider">Sugestão Automática</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Avalie aumentar a prioridade da tarefa #{chain.bottleneck.id} para destravar o fluxo.
          </p>
        </div>
      </div>

      {/* Divisória visual entre os mapas, se não for o último */}
      {!isLast && <div className="w-full h-px bg-border/50 my-8"></div>}
    </div>
  );
}

export function DependencyMap({ chains }: DependencyMapProps) {
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

  // A tela principal mostra apenas o 1º gargalo para poupar espaço
  const displayChains = chains.slice(0, 1);
  const hasMore = chains.length > 1;

  return (
    <>
      {/* ================= COMPONENTE NA TELA PRINCIPAL ================= */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-sm font-bold text-foreground">Mapa de Dependências</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Visualização de gargalos e fluxos de trabalho</p>
          </div>
          <button 
            onClick={() => chains.length > 0 && setIsModalOpen(true)}
            className={`p-1.5 rounded-md transition-colors ${chains.length > 0 ? 'hover:bg-muted text-muted-foreground hover:text-foreground' : 'text-muted-foreground/30 cursor-not-allowed'}`}
            title="Expandir Todos os Mapas"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {chains.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-70 bg-muted/10 rounded-lg border border-dashed border-border">
            <CheckCircle2 size={40} className="text-green-500 mb-3" />
            <h3 className="text-sm font-bold text-foreground">Fluxo Livre</h3>
            <p className="text-xs text-muted-foreground mt-1">Nenhuma tarefa está retendo o progresso da equipe no momento.</p>
          </div>
        ) : (
          <div>
            {displayChains.map((chain) => (
              <ChainVisualizer key={chain.id} chain={chain} isLast={true} />
            ))}
            
            {hasMore && (
              <div className="mt-6 flex justify-center border-t border-border/50 pt-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Ver mais {chains.length - 1} {chains.length - 1 === 1 ? 'gargalo' : 'gargalos'} ativos
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL EXPANDIDO ================= */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative w-full max-w-4xl bg-card border border-border/50 rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-border/50 bg-muted/10 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">Todos os Gargalos Identificados</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Visão detalhada das {chains.length} tarefas travando o fluxo de trabalho</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-card border border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 md:p-8 overflow-y-auto">
              {chains.map((chain, index) => (
                <ChainVisualizer 
                  key={chain.id} 
                  chain={chain} 
                  isLast={index === chains.length - 1} 
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}