"use client";

import { useState } from "react";
import { updateTaskAction } from "@/actions/task-actions";
import { Loader2, Edit2, CheckCircle } from "lucide-react"; 
import { Button } from "@/components/ui/Button";
import type { TaskResponse } from "@/actions/task-actions";
import type { CategoryResponse } from "@/actions/category-actions";

import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { TaskModal } from "@/components/modals/TaskModal";

interface ProgressRingProps {
  readonly progress: number;
  readonly colorClass?: string;
}

function ProgressRing({ progress, colorClass = "text-primary" }: ProgressRingProps) {
  const radius = 20;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="28" cy="28" r={radius} className="stroke-muted/50" strokeWidth="3" fill="transparent" />
        <circle 
          cx="28" cy="28" r={radius} 
          className={colorClass} 
          strokeWidth="3" fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-foreground">{progress}%</span>
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
  
  const parentTask = allTasks.find(t => t.id === task.parentTaskId);
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
  
  return (
    <>
      <div 
        onClick={() => setIsDetailsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsDetailsOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes da tarefa: ${task.title}`}
        className={`flex items-center justify-between p-5 bg-card border rounded-lg shadow-sm mb-3 transition-all hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50
        ${isCritical ? 'border-l-4 border-l-red-500 border-t-border border-r-border border-b-border' : 'border-border'}
      `}>
        <div className="flex items-center gap-5 overflow-hidden">
          <ProgressRing progress={task.branchProgress || 0} colorClass={ringColor} />
          
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-foreground text-sm truncate">{task.title}</h3>
              {categoryName && (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider shrink-0">
                  {categoryName}
                </span>
              )}
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-2xl">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button 
            variant="ghost" 
            className="h-10 w-10 p-0 rounded-full text-muted-foreground hover:text-foreground" 
            title="Editar Tarefa"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
          >
            <Edit2 size={18} />
          </Button>
          
          <Button 
            variant="ghost" 
            className="h-10 w-10 p-0 rounded-full text-muted-foreground hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400" 
            title="Concluir Tarefa"
            disabled={isCompleting}
            onClick={handleQuickComplete} 
          >
            {/* 4. Feedback visual usando o Loader2 que você já tinha importado */}
            {isCompleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CheckCircle size={18} />
            )}
          </Button>
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