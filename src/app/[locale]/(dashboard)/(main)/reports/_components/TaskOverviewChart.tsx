import React from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import type { TaskResponse } from "@/actions/task-actions";

export function TaskOverviewChart({ tasks }: { readonly tasks: TaskResponse[] }) {
  // 1. Gera os últimos 7 dias dinamicamente
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // Do 6º dia atrás até hoje (0)
    
    // Converte para YYYY-MM-DD para bater com o formato que vem do banco
    const dateString = d.toISOString().split('T')[0];
    
    // Pega a sigla do dia da semana (ex: 'seg', 'ter') e formata
    const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '');
    
    return { dateString, dayName };
  });

  // 2. Cruza os dias com os deadlines das tarefas
  const chartData = last7Days.map(({ dateString, dayName }) => {
    const tasksForDay = tasks.filter(t => t.deadline && t.deadline.startsWith(dateString));
    
    return { 
      day: dayName.substring(0, 3), // Garante que terá só 3 letras (SEG, TER)
      scheduled: tasksForDay.length, 
      completed: tasksForDay.filter(t => t.status === "COMPLETED").length 
    };
  });

  // 3. Totais para calcular os KPIs
  const totalScheduled = chartData.reduce((acc, curr) => acc + curr.scheduled, 0);
  const totalCompleted = chartData.reduce((acc, curr) => acc + curr.completed, 0);
  const efficiencyRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  return (
    <div className="xl:col-span-2 rounded-lg border border-border bg-card p-5 shadow-sm flex flex-col justify-between min-h-[320px]">
      
      {/* ================= CABEÇALHO E KPIS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            <Activity size={12} className="text-primary" />
            <span>Métricas de Fluxo (Últimos 7 dias)</span>
          </div>
          <h2 className="text-sm font-bold text-foreground">Visão Geral de Prazos</h2>
        </div>

        {/* Mini-Indicadores */}
        <div className="flex items-center gap-4 bg-muted/30 px-3 py-1.5 rounded-md border border-border/50">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Entrega no Prazo</span>
            <span className="text-xs font-extrabold text-foreground">{efficiencyRate}%</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Saldo Semanal</span>
            <span className={`text-xs font-extrabold flex items-center gap-0.5 ${totalCompleted >= totalScheduled ? 'text-green-600' : 'text-orange-500'}`}>
              {totalCompleted >= totalScheduled ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(totalCompleted - totalScheduled)} un
            </span>
          </div>
        </div>
      </div>

      {/* ================= CORPO DO GRÁFICO ================= */}
      <div className="flex-1 flex items-end justify-between gap-3 px-2 md:px-4 pb-2 mt-2 border-b border-border">
        {chartData.map((col, i) => {
          // Altura percentual baseada num teto para o gráfico não quebrar
          const maxVolume = Math.max(...chartData.map(d => d.scheduled), 10); // Teto mínimo de 10
          const heightScheduled = Math.min(100, (col.scheduled / maxVolume) * 100);
          const heightCompleted = Math.min(100, (col.completed / maxVolume) * 100);

          return (
            <div key={i} className="flex flex-col items-center gap-2 w-full group">
              
              <div className="flex items-end gap-1.5 w-full justify-center h-44 relative">
                
                {/* Tooltip flutuante */}
                <div className="absolute -top-8 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap border border-border">
                  {col.completed} entregues / {col.scheduled} previstas
                </div>

                {/* Barra de Previstas (Laranja) */}
                <div 
                  className="w-full max-w-[14px] bg-orange-300/60 dark:bg-orange-500/30 rounded-t transition-all duration-300 group-hover:bg-orange-400" 
                  style={{ height: `${heightScheduled}%` }}
                />

                {/* Barra de Concluídas (Primária) */}
                <div 
                  className="w-full max-w-[14px] bg-primary rounded-t transition-all duration-300 group-hover:brightness-110 shadow-sm" 
                  style={{ height: `${heightCompleted}%` }}
                />
              </div>

              <span className="text-[10px] font-bold text-muted-foreground tracking-widest">{col.day}</span>
            </div>
          );
        })}
      </div>

      {/* ================= RODAPÉ ================= */}
      <div className="flex items-center justify-between pt-4 mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Concluídas ({totalCompleted})</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-300/80"></span> Previstas ({totalScheduled})</span>
        </div>
      </div>

    </div>
  );
}