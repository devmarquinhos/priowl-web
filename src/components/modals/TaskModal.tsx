"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, Trash2, Calendar, Link as LinkIcon, 
  Plus, Info, Edit3, Shield, CheckCircle2,
  Check, Loader2
} from "lucide-react";
import type { TaskResponse, SubTaskResponse } from "@/actions/task-actions";
import type { CategoryResponse } from "@/actions/category-actions";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "@/actions/task-actions";

interface TaskModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly task?: TaskResponse | null; 
  readonly categories?: CategoryResponse[];
  readonly allTasks?: TaskResponse[];
  readonly onDelete?: (taskId: number) => Promise<void>;
}

const initialFormState = {
  title: "",
  status: "PENDING",
  categoryId: "" as number | "",
  importance: 3,
  deadline: "",
  parentTaskId: "" as number | "",
  description: ""
};

const getInitialFormData = (task?: TaskResponse | null) => {
  if (!task) return initialFormState;
  return {
    title: task.title || "",
    status: task.status || "PENDING",
    categoryId: task.categoryId || "",
    importance: task.importance || 3,
    deadline: task.deadline ? task.deadline.split("T")[0] : "",
    parentTaskId: task.parentTaskId || "",
    description: task.description || ""
  };
};

export function TaskModal({ 
  isOpen, 
  onClose, 
  task = null, 
  categories = [], 
  allTasks = [],
  onDelete
}: TaskModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(() => getInitialFormData(task));
  const [subtasks, setSubtasks] = useState<SubTaskResponse[]>(() => task?.subtasks || []);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevTask, setPrevTask] = useState(task);

  if (isOpen !== prevIsOpen || task !== prevTask) {
    setPrevIsOpen(isOpen);
    setPrevTask(task);
    if (isOpen) {
      setFormData(getInitialFormData(task));
      setSubtasks(task?.subtasks || []);
    }
  }

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof initialFormState, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    if (!task?.id) return;
    if (!confirm("Tem certeza que deseja excluir esta tarefa de forma permanente?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteTaskAction(task.id);

      
      if (result.success) {
        if (onDelete) await onDelete(task.id);
        window.dispatchEvent(new Event("tasks-updated"));
        onClose();
      } else {
        alert(result.error || "Não foi possível excluir a tarefa.");
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro inesperado ao conectar com o servidor.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
      title: formData.title,
      status: formData.status,
      description: formData.description,
      categoryId: formData.categoryId === "" ? null : Number(formData.categoryId),
      importance: Number(formData.importance),
      deadline: formData.deadline ? `${formData.deadline}T00:00:00Z` : undefined,
      parentTaskId: formData.parentTaskId === "" ? null : Number(formData.parentTaskId),
      subtaskIds: subtasks.map(st => st.id)
    };

      let result;
      
      if (task?.id) {
        result = await updateTaskAction(task.id, payload);
      } else {
        result = await createTaskAction(payload);
      }

      if (result.success) {
        onClose(); 
        window.dispatchEvent(new Event("tasks-updated"));
        router.refresh();
      } else {
        console.error("Erro da API:", result.error);
        alert(result.error || "Ocorreu um erro ao salvar a tarefa.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro inesperado ao conectar com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button 
        type="button"
        className="absolute inset-0 w-full h-full bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 cursor-default focus:outline-none"
        onClick={onClose}
        aria-label="Fechar modal"
      />

      <form 
        onSubmit={handleSave}
        className="relative w-full max-w-3xl bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* HEADER */}
        <div className="flex flex-col gap-4 p-6 border-b border-border/50 bg-card/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="taskTitle" className="sr-only">Título da Tarefa</label>
              <input 
                id="taskTitle"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Qual é o título da tarefa?"
                className="w-full text-2xl font-extrabold text-foreground bg-transparent border-none outline-none focus:ring-0 placeholder-muted-foreground"
                required
              />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground shrink-0 bg-muted/50 p-1.5 rounded-lg border border-border/50">
              {task && (
                <button 
                  type="button" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50" 
                  title="Excluir tarefa"
                  aria-label="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="w-px h-5 bg-border mx-1" />
              
              <button 
                type="button" 
                onClick={onClose} 
                className="p-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors" 
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="space-y-1.5">
              <label htmlFor="status" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-muted-foreground/70" /> Status
              </label>
              <select 
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full bg-card border border-border hover:border-border/80 text-foreground font-medium text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all"
              >
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="categoryId" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Shield size={14} className="text-muted-foreground/70" /> Categoria
              </label>
              <select 
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-card border border-border hover:border-border/80 text-foreground font-medium text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all"
              >
                <option value="">Nenhuma categoria</option>
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(cat as any).title}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Nenhuma categoria cadastrada</option>
                )}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="importance" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Info size={14} className="text-muted-foreground/70" /> Importância
              </label>
              <select 
                id="importance"
                value={formData.importance}
                onChange={(e) => handleChange("importance", Number(e.target.value))}
                className="w-full bg-card border border-border hover:border-border/80 text-foreground font-medium text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all"
              >
                <option value={5}>Nível 5 - Crítica</option>
                <option value={4}>Nível 4 - Alta</option>
                <option value={3}>Nível 3 - Média</option>
                <option value={2}>Nível 2 - Baixa</option>
                <option value={1}>Nível 1 - Mínima</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="deadline" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Calendar size={14} className="text-muted-foreground/70" /> Prazo Final
              </label>
              <input 
                id="deadline"
                type="date" 
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="w-full bg-card border border-border hover:border-border/80 text-foreground font-medium text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-text [color-scheme:light_dark]"
              />
            </div>
            
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
              <label htmlFor="parentTaskId" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <LinkIcon size={14} className="text-muted-foreground/70" /> Vínculo de Dependência
              </label>
              <select 
                id="parentTaskId"
                value={formData.parentTaskId}
                onChange={(e) => handleChange("parentTaskId", e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-card border border-border hover:border-border/80 text-foreground font-medium text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all"
              >
                <option value="">Independente (Nenhuma)</option>
                {allTasks
                  .filter((t) => t.id !== task?.id)
                  .map((t) => (
                  <option key={t.id} value={t.id}>#{t.id} - {t.title}</option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-border/50" />

          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center gap-2 text-sm font-bold text-foreground/90">
              <Edit3 size={16} className="text-primary" /> Descrição Detalhada
            </label>
            <textarea 
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Adicione o contexto, links úteis ou o passo a passo para realizar esta tarefa..."
              className="w-full bg-card border border-border text-foreground text-sm rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y min-h-[100px] leading-relaxed shadow-sm"
            />
          </div>

          <SubtasksSection 
            subtasks={subtasks} 
            setSubtasks={setSubtasks} 
            allTasks={allTasks} 
            currentTaskId={task?.id} 
          />

        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-border bg-card/50 gap-4">
          <div className="text-xs font-medium text-muted-foreground w-full sm:w-auto text-center sm:text-left">
            {task ? `Editando tarefa #${task.id || ''}` : "Criando nova tarefa"}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-foreground bg-card border border-border rounded-xl hover:bg-muted disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary border border-transparent rounded-xl hover:opacity-90 shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-4 focus:ring-primary/20"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

function SubtasksSection({ 
  subtasks, 
  setSubtasks, 
  allTasks, 
  currentTaskId 
}: { 
  readonly subtasks: SubTaskResponse[]; 
  readonly setSubtasks: React.Dispatch<React.SetStateAction<SubTaskResponse[]>>;
  readonly allTasks: TaskResponse[];
  readonly currentTaskId?: number;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const availableTasks = allTasks.filter(
    (t) => t.id !== currentTaskId && !subtasks.some((st) => st.id === t.id)
  );

  const handleAttachSubtask = () => {
    if (!selectedTaskId) return;
    const taskToAdd = availableTasks.find(t => t.id === Number(selectedTaskId));
    
    if (taskToAdd) {
      const newSubtask: SubTaskResponse = {
        id: taskToAdd.id,
        title: taskToAdd.title,
        status: taskToAdd.status,
      };
      
      setSubtasks([...subtasks, newSubtask]);
      setSelectedTaskId("");
      setIsAdding(false);
    }
  };

  const handleRemoveSubtask = (idToRemove: number) => {
    setSubtasks(subtasks.filter(st => st.id !== idToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold text-foreground/90">
          <ListChecksIcon className="text-primary w-4 h-4" /> Subtarefas
        </label>
        
        {!isAdding && (
          <button 
            type="button" 
            onClick={() => setIsAdding(true)}
            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary/20 transition-colors"
          >
            <Plus size={14} /> Anexar Tarefa
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 bg-primary/5 p-3 rounded-xl border border-primary/20 animate-in fade-in zoom-in-95 duration-200">
          <select 
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="flex-1 bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2 outline-none focus:border-primary"
          >
            <option value="">Selecione uma tarefa existente...</option>
            {availableTasks.map(t => (
              <option key={t.id} value={t.id}>#{t.id} - {t.title}</option>
            ))}
          </select>
          <button 
            type="button"
            onClick={handleAttachSubtask}
            disabled={!selectedTaskId}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Confirmar adição"
          >
            <Check size={16} />
          </button>
          <button 
            type="button"
            onClick={() => {
              setIsAdding(false);
              setSelectedTaskId("");
            }}
            className="p-2 bg-card border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors"
            aria-label="Cancelar adição"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {subtasks.length > 0 ? (
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
          {subtasks.map((st, index) => (
            <div key={st.id} className={`grid grid-cols-[1fr_auto_auto] gap-4 items-center p-3 hover:bg-muted/50 transition-colors ${index !== subtasks.length - 1 ? 'border-b border-border/50' : ''}`}>
              <span className="text-sm text-foreground font-medium truncate">{st.title}</span>
              <StatusBadge status={st.status} />
              <button 
                type="button" 
                onClick={() => handleRemoveSubtask(st.id)}
                className="text-muted-foreground hover:text-red-500 p-1 rounded-md hover:bg-red-500/10 transition-colors"
                title="Desanexar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/80 bg-card/50 rounded-xl text-muted-foreground text-sm">
            <ListChecksIcon className="w-8 h-8 mb-2 text-muted-foreground/50" />
            <p>Nenhuma subtarefa anexada.</p>
          </div>
        )
      )}
    </div>
  );
}

function ListChecksIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 6h11" />
      <path d="M10 12h11" />
      <path d="M10 18h11" />
      <path d="m3 6 2 2 4-4" />
      <path d="m3 12 2 2 4-4" />
    </svg>
  );
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const styles: Record<string, string> = {
    "COMPLETED": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "IN_PROGRESS": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "PENDING": "bg-muted text-muted-foreground border-border",
    "CANCELLED": "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const labels: Record<string, string> = {
    "COMPLETED": "CONCLUÍDO",
    "IN_PROGRESS": "EM CURSO",
    "PENDING": "PENDENTE",
    "CANCELLED": "CANCELADO",
  };

  const appliedClass = styles[status] || "bg-muted text-muted-foreground border-border";
  const appliedLabel = labels[status] || status;

  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider whitespace-nowrap ${appliedClass}`}>
      {appliedLabel}
    </span>
  );
}