import { 
  AlertCircle, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  LucideIcon,
  ChevronRight,
  XCircle
} from "lucide-react";
import { getTasksAction, getDashboardSummaryAction } from "@/actions/task-actions";
import { getMinhasCategoriasAction } from "@/actions/category-actions";
import { getUserProfile } from "@/actions/user-actions"; 
import { TaskItem } from "@/components/item/TaskItem";
import { NewTaskButton } from "./_components/NewTaskButton";
import { DashboardFilter } from "./_components/DashboardFilter";

interface SectionHeaderProps {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly colorClass: string;
}

function SectionHeader({ title, icon: Icon, colorClass }: SectionHeaderProps) {
  return (
    <summary className="flex items-center gap-3 mt-6 mb-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none group">
      <div className="transition-transform duration-200 group-open:rotate-90 text-muted-foreground">
        <ChevronRight size={16} />
      </div>
      <div className={`flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md ${colorClass}`}>
        <Icon size={14} />
        {title}
      </div>
      <div className="flex-1 h-px bg-border transition-colors group-hover:bg-muted-foreground/30"></div>
    </summary>
  );
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage(props: Readonly<{ searchParams: SearchParams }>) {
  const searchParams = await props.searchParams;
  
  const filter = (searchParams?.filter as string) || "all"; 
  const searchQuery = (searchParams?.q as string) || "";
  const importanceFilter = (searchParams?.importance as string) || "all";
  const dateFilter = (searchParams?.date as string) || "";
  const categoryFilter = searchParams?.category as string | undefined;

  const [userProfile, summary, taskList, categoryList] = await Promise.all([
    getUserProfile(),
    getDashboardSummaryAction(),
    getTasksAction(),
    getMinhasCategoriasAction()
  ]);

  const fullName = userProfile?.username || "Usuário";
  const userName = fullName.split(" ")[0];

  const pendingCount = summary?.pendingTasks || 0;
  const overallProgress = summary?.overallProgress || 0;

  // 🔹 FILTRAGEM
  let displayTasks = [...taskList];

  if (categoryFilter) {
    displayTasks = displayTasks.filter(t => Number(t.categoryId) === Number(categoryFilter));
  }
  
  if (filter === "pending") {
    displayTasks = displayTasks.filter(t => t.status !== "COMPLETED" && t.status !== "CANCELLED");
  } else if (filter === "completed") {
    displayTasks = displayTasks.filter(t => t.status === "COMPLETED");
  } else if (filter === "cancelled") {
    displayTasks = displayTasks.filter(t => t.status === "CANCELLED");
  }

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    displayTasks = displayTasks.filter(t => 
      t.title?.toLowerCase().includes(lowerQuery) || 
      t.description?.toLowerCase().includes(lowerQuery)
    );
  }

  if (importanceFilter !== "all") {
    if (importanceFilter === "critical") displayTasks = displayTasks.filter(t => Number(t.importance) === 5);
    if (importanceFilter === "normal") displayTasks = displayTasks.filter(t => Number(t.importance) !== 5);
  }

  if (dateFilter) {
    displayTasks = displayTasks.filter(t => {
      if (!t.deadline) return false; 
      return t.deadline.toString().startsWith(dateFilter);
    });
  }

  // 🔹 ORDENAÇÃO POR PRAZO
  displayTasks.sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;  
    if (!b.deadline) return -1; 
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // 🔹 AGRUPAMENTO
  const completedTasks = displayTasks.filter(t => t.status === "COMPLETED");
  const cancelledTasks = displayTasks.filter(t => t.status === "CANCELLED"); 
  const activeTasks = displayTasks.filter(t => t.status !== "COMPLETED" && t.status !== "CANCELLED");
  
  const criticalTasks = activeTasks.filter(t => Number(t.importance) === 5);
  const workTasks = activeTasks.filter(t => Number(t.importance) !== 5);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Painel de Controle</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bem-vindo de volta, <span className="font-semibold text-foreground">{userName}</span>. Você tem {pendingCount} tarefas pendentes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DashboardFilter />
          <NewTaskButton categories={categoryList} tasks={taskList} />
        </div>
      </div>

      {/* METRICAS / RESUMO GERAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Progresso</span>
            <TrendingUp size={14} className="text-primary" />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xl font-extrabold text-foreground leading-none">{overallProgress}%</span>
            </div>
            <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ativas</span>
            <ListTodo size={14} className="text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground leading-none">
            {summary?.totalActiveTasks || 0}
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Concluídas</span>
            <CheckCircle2 size={14} className="text-green-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground leading-none">
            {summary?.completedTasks || 0}
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pendentes</span>
            <Clock size={14} className="text-amber-500" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-xl font-extrabold text-foreground leading-none">
              {summary?.pendingTasks || 0}
            </span>
            {summary?.inProgressTasks ? (
              <span className="text-[10px] text-muted-foreground font-medium leading-none mb-0.5">
                {summary.inProgressTasks} em andamento
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* LISTAGEM DE TAREFAS */}
      <div className="pb-10 space-y-1">

        {/* Críticas */}
        {criticalTasks.length > 0 && (
          <details open className="group">
            <SectionHeader title="Crítica" icon={AlertCircle} colorClass="bg-red-500/10 text-red-600 dark:text-red-400" />
            <div className="flex flex-col gap-2 pl-2">
              {criticalTasks.map(task => (
                <TaskItem key={task.id} task={task} isCritical categories={categoryList} allTasks={taskList} />
              ))}
            </div>
          </details>
        )}

        {/* Trabalho */}
        {workTasks.length > 0 && (
          <details open className="group">
            <SectionHeader title="Trabalho" icon={Briefcase} colorClass="bg-primary/10 text-primary" />
            <div className="flex flex-col gap-2 pl-2">
              {workTasks.map(task => (
                <TaskItem key={task.id} task={task} categories={categoryList} allTasks={taskList} />
              ))}
            </div>
          </details>
        )}

        {/* Concluídas */}
        {completedTasks.length > 0 && (
          <details className="group mt-6">
            <SectionHeader title="Concluídas" icon={CheckCircle2} colorClass="bg-green-500/10 text-green-600 dark:text-green-400" />
            <div className="flex flex-col gap-2 pl-2 opacity-70">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} categories={categoryList} allTasks={taskList} />
              ))}
            </div>
          </details>
        )}

        {/* Canceladas */}
        {cancelledTasks.length > 0 && (
          <details className="group mt-2">
            <SectionHeader title="Canceladas" icon={XCircle} colorClass="bg-muted text-muted-foreground" />
            <div className="flex flex-col gap-2 pl-2 opacity-50 grayscale">
              {cancelledTasks.map(task => (
                <TaskItem key={task.id} task={task} categories={categoryList} allTasks={taskList} />
              ))}
            </div>
          </details>
        )}

        {/* Estado Vazio */}
        {displayTasks.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-border rounded-lg mt-6 bg-card/50">
            <h3 className="text-sm font-bold text-foreground mb-1">Tudo limpo por aqui!</h3>
            <p className="text-muted-foreground text-xs">Nenhuma tarefa encontrada com o filtro atual.</p>
          </div>
        )}

      </div>
    </div>
  );
}