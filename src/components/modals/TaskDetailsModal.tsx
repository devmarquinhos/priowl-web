"use client";

import { useState } from "react";
import { 
  X, Calendar, Edit2, CheckCircle, RefreshCw, 
  Check, Clock, Lock, ChevronRight, Shield, Trash2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateTaskAction, deleteTaskAction } from "@/actions/task-actions"; // <-- Importando as Server Actions
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

export function TaskDetailsModal({ 
  isOpen, 
  onClose, 
  onEdit, 
  task, 
  allTasks = [], 
  categories = [] 
}: TaskDetailsModalProps) {
  // Estados de loading para os botões
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  // ... (mesmas lógicas de status e variáveis que você já tem) ...
  const statusConfig = {
    PENDING: { label: "Pendente", className: "bg-muted text-muted-foreground border-border", Icon: Clock },
    IN_PROGRESS: { label: "Em Progresso", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", Icon: RefreshCw },
    COMPLETED: { label: "Concluída", className: "bg-green-500/10 text-green-600 border-green-500/20", Icon: CheckCircle },
    CANCELLED: { label: "Cancelada", className: "bg-red-500/10 text-red-600 border-red-500/20", Icon: X },
  };
  const currentStatus = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.PENDING;
  const StatusIcon = currentStatus.Icon;
  
  const importanceConfig = {
    5: { label: "Crítica", className: "bg-red-500/10 text-red-600 border-red-500/20" },
    4: { label: "Alta", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    3: { label: "Média", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    2: { label: "Baixa", className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
    1: { label: "Mínima", className: "bg-muted text-muted-foreground border-border" },
  };
  const currentImportance = importanceConfig[(task.importance as keyof typeof importanceConfig) || 3] || importanceConfig[3];
  
  const rawDate = task.deadline;
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('pt-BR') : "Sem data";
  const progressPercentage = task.branchProgress || 0;
  
  const subtasks: SubTaskResponse[] = task.subtasks || []; 
  const completedSubtasksCount = subtasks.filter(st => st.status === "COMPLETED").length;
  
  const parentTask = allTasks.find(t => t.id === task.parentTaskId);
  const parentTaskName = parentTask ? parentTask.title : `Tarefa #${task.parentTaskId}`;
  
  // VERIFICAÇÃO DE BLOQUEIO: Se a tarefa pai existe e o status dela NÃO é COMPLETED
  const isBlockedByDependency = !!task.parentTaskId && parentTask?.status !== "COMPLETED";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = categories.find(c => c.id === task.categoryId) as any;
  const categoryName = category ? category.title : "Sem categoria";

  /* =========================================================
     FUNÇÕES DE AÇÃO (CONCLUIR E DELETAR)
     ========================================================= */
  const handleComplete = async () => {
    if (isBlockedByDependency) {
      alert(`Não é possível concluir. Conclua a tarefa "${parentTaskName}" primeiro.`);
      return;
    }
    
    setIsCompleting(true);
    const result = await updateTaskAction(task.id, { status: "COMPLETED" });
    setIsCompleting(false);

    if (result.success) {
      onClose(); // Fecha o modal após o sucesso
    } else {
      alert(result.error || "Erro ao concluir a tarefa.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa de forma permanente?")) return;

    setIsDeleting(true);
    const result = await deleteTaskAction(task.id);
    setIsDeleting(false);

    if (result.success) {
      onClose();
    } else {
      alert(result.error || "Erro ao deletar a tarefa.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-6 pb-4 border-b border-border/50 bg-card/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Shield size={12} className="text-muted-foreground/70" />
              <span>{categoryName}</span>
            </div>
            
            {/* NOVO: Botão de deletar na parte superior */}
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="text-red-500/70 hover:text-red-600 hover:bg-red-500/10 p-1.5 rounded-md transition-colors disabled:opacity-50"
              title="Deletar tarefa"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          </div>

          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground leading-tight pr-4">
              {task.title}
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0 mt-1 transition-colors bg-muted/50 p-1.5 rounded-md">
              <X size={20} />
            </button>
          </div>

          {/* Chips de Informação... */}
        </div>

        {/* CORPO */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background/50">
          {/* Mudei de `hasDependencyBlock` para `isBlockedByDependency` para só mostrar o aviso se a tarefa pai AINDA NÃO ESTIVER CONCLUÍDA */}
          {isBlockedByDependency && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-700 dark:text-amber-500">
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
            <h3 className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-3">
              Descrição Detalhada
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap bg-card p-4 rounded-xl border border-border/50">
              {task.description || "Sem descrição detalhada cadastrada para esta tarefa."}
            </p>
          </section>

          {/* Progresso e Checklist Integrados (Correção variáveis não usadas) */}
          <section className="bg-card p-4 rounded-xl border border-border/50">
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
        <div className="p-6 border-t border-border bg-card/50">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-primary text-primary hover:bg-primary/10 font-bold h-12 rounded-xl"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              <Edit2 size={16} className="mr-2" /> Editar
            </Button>

            {/* Atualização no Botão de Concluir */}
            <Button 
              variant="primary" 
              className={`flex-1 font-bold h-12 rounded-xl shadow-lg shadow-primary/20 ${isBlockedByDependency ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
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

      </div>
    </>
  );
}