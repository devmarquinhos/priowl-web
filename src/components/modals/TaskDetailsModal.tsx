"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, Calendar, Edit2, CheckCircle, RefreshCw, 
  Check, Clock, Lock, Shield, Trash2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateTaskAction, deleteTaskAction } from "@/actions/task-actions"; 
import type { TaskResponse, SubTaskResponse } from "@/actions/task-actions";
import type { CategoryResponse } from "@/actions/category-actions";

interface TaskDetailsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit: () => void;
  readonly task: TaskResponse | null;
  readonly allTasks?: TaskResponse[];
  readonly categories?: CategoryResponse[];
}

const STATUS_CONFIG = {
  PENDING: { label: "Pendente", className: "bg-muted text-muted-foreground border-border", Icon: Clock },
  IN_PROGRESS: { label: "Em Progresso", className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", Icon: RefreshCw },
  COMPLETED: { label: "Concluída", className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", Icon: CheckCircle },
  CANCELLED: { label: "Cancelada", className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", Icon: X },
} as const;

const IMPORTANCE_CONFIG = {
  5: { label: "Crítica", className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
  4: { label: "Alta", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  3: { label: "Média", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  2: { label: "Baixa", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20" },
  1: { label: "Mínima", className: "bg-muted text-muted-foreground border-border" },
} as const;

export function TaskDetailsModal({ 
  isOpen, 
  onClose, 
  onEdit, 
  task, 
  allTasks = [], 
  categories = [] 
}: TaskDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  if (!isOpen || !task || !mounted) return null;

  const currentStatus = STATUS_CONFIG[task.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  const currentImportance = IMPORTANCE_CONFIG[(task.importance as keyof typeof IMPORTANCE_CONFIG) || 3] || IMPORTANCE_CONFIG[3];

  const rawDate = task.deadline;
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('pt-BR') : "Sem data";
  const progressPercentage = task.branchProgress || 0;

  const subtasks: SubTaskResponse[] = task.subtasks || []; 
  const completedSubtasksCount = subtasks.filter(st => st.status === "COMPLETED").length;

  const parentTask = allTasks.find(t => t.id === task.parentTaskId);
  const parentTaskName = parentTask ? parentTask.title : `Tarefa #${task.parentTaskId}`;

  const isBlockedByDependency = !!task.parentTaskId && parentTask?.status !== "COMPLETED";

  const category = categories.find(c => c.id === task.categoryId);
  const categoryName = category ? category.title : "Sem categoria";

  const handleComplete = async () => {
    if (isBlockedByDependency) {
      alert(`Não é possível concluir. Conclua a tarefa "${parentTaskName}" primeiro.`);
      return;
    }
    
    setIsCompleting(true);
    try {
      const result = await updateTaskAction(task.id, { status: "COMPLETED" });
      if (result.success) {
        onClose();
        window.dispatchEvent(new Event("tasks-updated"));
      } else {
        alert(result.error || "Erro ao concluir a tarefa.");
      }
    } catch (error) {
      console.error("Erro ao concluir tarefa:", error);
      alert("Erro inesperado ao conectar com o servidor.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa de forma permanente?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteTaskAction(task.id);
      if (result.success) {
        onClose();
        window.dispatchEvent(new Event("tasks-updated"));
      } else {
        alert(result.error || "Erro ao deletar a tarefa.");
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro inesperado ao conectar com o servidor.");
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <>
      <div 
        tabIndex={-1}
        role="button"
        aria-label="Fechar detalhes da tarefa"
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-default" 
        onClick={onClose} 
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      />

      <aside className="fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-card shadow-2xl z-[9999] flex flex-col animate-in slide-in-from-right duration-300 border-l border-border/50">
        
        {/* HEADER */}
        <div className="p-6 pb-4 border-b border-border/50 bg-muted/10 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-card px-2 py-1 rounded-md border border-border/50 shadow-sm">
              <Shield size={12} className="text-primary" />
              <span>{categoryName}</span>
            </div>
            
            <button 
              type="button"
              onClick={handleDelete} 
              disabled={isDeleting}
              className="text-red-500/70 hover:text-red-600 hover:bg-red-500/10 p-1.5 rounded-md transition-colors disabled:opacity-50"
              title="Deletar tarefa"
              aria-label="Excluir tarefa"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          </div>

          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight pr-4">
              {task.title}
            </h2>
            <button 
              type="button"
              onClick={onClose} 
              className="text-muted-foreground hover:text-foreground shrink-0 mt-1 transition-colors bg-card hover:bg-muted p-1.5 border border-border/50 rounded-md"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          {/* CHIPS DE INFORMAÇÃO */}
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${currentStatus.className}`}>
              <currentStatus.Icon size={12} /> {currentStatus.label}
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${currentImportance.className}`}>
              {currentImportance.label}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border border-border bg-card text-muted-foreground">
              <Calendar size={12} /> {formattedDate}
            </div>
          </div>
        </div>

        {/* CORPO */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background">
          {isBlockedByDependency && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-700 dark:text-amber-500 shadow-sm">
              <Lock size={18} className="shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">
                  Dependência Ativa
                </h4>
                <p className="text-xs text-amber-700/90 dark:text-amber-500/90 leading-relaxed">
                  Aguardando a conclusão de: <br />
                  <strong className="text-amber-800 dark:text-amber-400 text-sm">{parentTaskName}</strong>
                </p>
              </div>
            </div>
          )}

          <section>
            <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-3 flex items-center gap-2">
              Descrição Detalhada
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap bg-card p-4 rounded-xl border border-border/50 shadow-sm">
              {task.description || "Sem descrição detalhada cadastrada para esta tarefa."}
            </p>
          </section>

          {/* PROGRESSO E CHECKLIST */}
          <section className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                {subtasks.length > 0 
                  ? `Checklist (${completedSubtasksCount} de ${subtasks.length})` 
                  : "Progresso Geral"
                }
              </h3>
              <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
            </div>
            
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden mb-5">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {subtasks.length > 0 ? (
              <div className="space-y-2 mt-2">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center shrink-0 transition-colors ${st.status === "COMPLETED" ? 'bg-primary text-primary-foreground' : 'border border-muted-foreground/30 bg-background group-hover:border-primary/50'}`}>
                      {st.status === "COMPLETED" && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm leading-relaxed ${st.status === "COMPLETED" ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-2">
                Nenhuma subtarefa cadastrada.
              </p>
            )}
          </section>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-border bg-muted/10 shrink-0">
          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outline" 
              className="flex-1 border-primary text-primary hover:bg-primary/10 font-bold h-12 rounded-xl"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              <Edit2 size={16} className="mr-2" /> Editar
            </Button>

            <Button 
              type="button"
              className={`flex-1 font-bold h-12 rounded-xl shadow-lg shadow-primary/20 ${isBlockedByDependency ? 'opacity-50 cursor-not-allowed grayscale' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              onClick={handleComplete}
              disabled={isCompleting || isBlockedByDependency || task.status === "COMPLETED"}
            >
              {isCompleting ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <CheckCircle size={16} className="mr-2" />
              )}
              {task.status === "COMPLETED" ? "Já Concluída" : "Concluir"}
            </Button>
          </div>
        </div>

      </aside>
    </>,
    document.body
  );
}