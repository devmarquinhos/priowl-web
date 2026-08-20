"use client";

import { useState } from "react";
import { updateTaskAction } from "@/actions/task-actions";
import { Loader2, Edit2, CheckCircle, Clock } from "lucide-react"; 
import { Button } from "@/components/ui/Button";
import type { TaskResponse } from "@/actions/task-actions";
import type { CategoryResponse } from "@/actions/category-actions";

import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { TaskModal } from "@/components/modals/TaskModal";
import { analyzeTaskDeadlines } from "@/services/deadline"; // 🔹 Import do serviço de prazos

interface ProgressRingProps {
  readonly progress: number;
  readonly colorClass?: string;
}

// 🔹 Anel de progresso
function ProgressRing({ progress, colorClass = "text-primary" }: ProgressRingProps) {
  const radius = 16;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="20" cy="20" r={radius} className="stroke-muted/50" strokeWidth="2.5" fill="transparent" />
        <circle 
          cx="20" cy="20" r={radius} 
          className={colorClass} 
          strokeWidth="2.5" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-foreground">{progress}%</span>
    </div>
  );
}

interface TaskItemProps {
  readonly task: TaskResponse;
  readonly isCritical?: boolean;
  readonly categories: CategoryResponse[];
  readonly allTasks: TaskResponse[];
}

export function TaskItem({ task, isCritical = false, categories, allTasks }: TaskItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const parentTask = allTasks?.find(t => t.id === task.parentTaskId);
  const isBlockedByDependency = !!task.parentTaskId && parentTask?.status !== "COMPLETED";
  
  // 🔹 ANÁLISE DE PRAZOS (Adaptando o TaskResponse para o formato esperado pelo serviço se necessário)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analyzedTask] = analyzeTaskDeadlines([{ ...task, dueDate: task.deadline } as any]);

  // Se a tarefa for crítica (importance === 5), garantimos a borda vermelha, caso contrário, usamos a do analisador
  const borderClass = isCritical ? "border-red-500" : (analyzedTask?.borderClass ?? "border-border");
  const badgeClass = analyzedTask?.badgeClass ?? "bg-muted text-muted-foreground border-border";
  const timeLeftText = analyzedTask?.timeLeftText ?? "Sem prazo";
  
  const categoryName = categories?.find(c => c.id === task.categoryId)?.title;
  const ringColor = isCritical || borderClass.includes("red") ? "text-red-500" : "text-primary";
  
  // 🔹 Formatação da data 
  const formattedDeadline = task.deadline 
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(new Date(task.deadline))
    : null;

  const handleQuickComplete = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (isBlockedByDependency) {
      alert("Não é possível concluir. Tarefa bloqueada por dependência.");
      return;
    }

    try {
      setIsCompleting(true);
      const payloadCompleto = {
        title: task.title,
        description: task.description,
        importance: task.importance,
        deadline: task.deadline,
        categoryId: task.categoryId,
        parentTaskId: task.parentTaskId,
        status: "COMPLETED"
      };

      await updateTaskAction(task.id, payloadCompleto);
    } catch (error) {
      console.error("Erro ao concluir tarefa:", error);
      alert("Erro ao tentar concluir a tarefa.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsDetailsOpen(true)}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return; 
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsDetailsOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes da tarefa: ${task.title}`}
        className={`flex items-center justify-between p-3 bg-card rounded-lg shadow-sm mb-2 transition-all hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 border-t border-r border-b border-l-4 ${borderClass}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <ProgressRing progress={task.branchProgress || 0} colorClass={ringColor} />
          
          <div className="flex flex-col truncate">
            {/* Título e Categoria */}
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-foreground text-sm truncate">{task.title}</h3>
              
              {categoryName && (
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider shrink-0">
                  {categoryName}
                </span>
              )}
            </div>
            
            {task.description && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* 🔹 Container da Direita: Status do Prazo + Botões de ação */}
        <div className="flex items-center gap-3 ml-2 shrink-0">
          
          {/* 🔹 Exibição Integrada do Analisador de Prazos */}
          {task.deadline && (
            <div className="flex flex-col items-end justify-center gap-1">
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border ${badgeClass} shrink-0 leading-none`}>
                {timeLeftText}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium shrink-0">
                <Clock size={10} />
                {formattedDeadline}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 ml-1">
            <Button 
              variant="ghost" 
              className="flex items-center justify-center h-8 w-8 p-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" 
              title="Editar Tarefa"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
            >
              <Edit2 size={16} className="shrink-0 text-muted-foreground hover:text-foreground" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center justify-center h-8 w-8 p-0 rounded-full text-muted-foreground hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400" 
              title="Concluir Tarefa"
              disabled={isCompleting || task.status === "COMPLETED"}
              onClick={handleQuickComplete} 
            >
              {isCompleting ? (
                <Loader2 size={16} className="animate-spin shrink-0" />
              ) : (
                <CheckCircle size={16} className="shrink-0 text-muted-foreground hover:text-green-600 dark:hover:text-green-400" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modais mantidos intactos */}
      {isDetailsOpen && (
        <TaskDetailsModal 
          isOpen={isDetailsOpen}
          task={task}
          allTasks={allTasks}
          categories={categories}
          onClose={() => setIsDetailsOpen(false)}
          onEdit={() => {
            setIsDetailsOpen(false);
            setIsEditModalOpen(true);
          }}
        />
      )}

      {isEditModalOpen && (
        <TaskModal 
          isOpen={isEditModalOpen}
          task={task}
          categories={categories}
          allTasks={allTasks}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}