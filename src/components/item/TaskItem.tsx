"use client";

import { useState } from "react";
import { updateTaskAction } from "@/actions/task-actions";
import { Loader2, Edit2, CheckCircle, Calendar } from "lucide-react"; 
import { Button } from "@/components/ui/Button";
import type { TaskResponse } from "@/actions/task-actions";
import type { CategoryResponse } from "@/actions/category-actions";

import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { TaskModal } from "@/components/modals/TaskModal";

interface ProgressRingProps {
  readonly progress: number;
  readonly colorClass?: string;
}

// 🔹 Anel de progresso reduzido para ficar mais compacto
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

  const categoryName = categories?.find(c => c.id === task.categoryId)?.title;
  const ringColor = isCritical ? "text-red-500" : "text-primary";
  
  // 🔹 Formatação amigável do prazo (Ex: 12 out)
  const formattedDeadline = task.deadline 
  ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' })
      .format(new Date(task.deadline))
  : null;
  
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
        className={`flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm mb-2 transition-all hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50
        ${isCritical ? 'border-l-4 border-l-red-500 border-t-border border-r-border border-b-border' : 'border-border'}
      `}>
        <div className="flex items-center gap-3 overflow-hidden">
          <ProgressRing progress={task.branchProgress || 0} colorClass={ringColor} />
          
          <div className="flex flex-col truncate">
            {/* 🔹 Título e Categoria */}
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

        {/* 🔹 Container da Direita: Prazo + Botões de ação */}
        <div className="flex items-center gap-3 ml-2 shrink-0">
          
          {/* 🔹 Exibição do Prazo na Direita com bg-primary */}
          {formattedDeadline && (
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
              <Calendar size={10} className="shrink-0" />
              {formattedDeadline}
            </span>
          )}

          <div className="flex items-center gap-1">
            {/* 🔹 Botão Editar */}
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
            
            {/* 🔹 Botão Concluir */}
            <Button 
              variant="ghost" 
              className="flex items-center justify-center h-8 w-8 p-0 rounded-full text-muted-foreground hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400" 
              title="Concluir Tarefa"
              disabled={isCompleting}
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