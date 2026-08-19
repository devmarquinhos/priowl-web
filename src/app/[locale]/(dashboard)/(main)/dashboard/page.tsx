import { 
  Filter, 
  AlertCircle, 
  Pin, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  LucideIcon,
  ChevronRight
} from "lucide-react";
import { getTasksAction, getDashboardSummaryAction } from "@/actions/task-actions";
import { getMinhasCategoriasAction } from "@/actions/category-actions";
import { getUserProfile } from "@/actions/user-actions"; 
import { Button } from "@/components/ui/Button";
import { TaskItem } from "@/components/item/TaskItem";
import { NewTaskButton } from "./_components/NewTaskButton";

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
      <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md ${colorClass}`}>
        <Icon size={14} />
        {title}
      </div>
      <div className="flex-1 h-px bg-border transition-colors group-hover:bg-muted-foreground/30"></div>
    </summary>
  );
}

export default async function DashboardPage() {
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

  const criticalTasks = taskList.filter(t => t.importance === 5 && t.status !== "COMPLETED" && t.status !== "CANCELLED");
  const pinnedTasks = taskList.filter(t => (t.importance === 4 || t.importance === 3) && t.status !== "COMPLETED" && t.status !== "CANCELLED");
  const workTasks = taskList.filter(t => (!t.importance || t.importance <= 2) && t.status !== "COMPLETED" && t.status !== "CANCELLED");

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Painel de Controle</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bem-vindo de volta, <span className="font-semibold text-foreground">{userName}</span>. Você tem {pendingCount} tarefas pendentes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 text-xs font-bold h-9">
            <Filter size={14} /> Filtros
          </Button>
          <NewTaskButton categories={categoryList} tasks={taskList} />
        </div>
      </div>

      {/* METRICAS / RESUMO GERAL (Cards Reduzidos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Progresso Geral */}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Progresso</span>
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xl font-extrabold text-foreground">{overallProgress}%</span>
            </div>
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Tarefas Ativas */}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ativas</span>
            <ListTodo size={16} className="text-blue-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground">
            {summary?.totalActiveTasks || 0}
          </div>
        </div>

        {/* Card 3: Concluídas */}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Concluídas</span>
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <div className="text-xl font-extrabold text-foreground">
            {summary?.completedTasks || 0}
          </div>
        </div>

        {/* Card 4: Pendentes / Em Andamento */}
        <div className="p-4 bg-card border border-border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pendentes</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-foreground">
              {summary?.pendingTasks || 0}
            </span>
            {summary?.inProgressTasks ? (
              <span className="text-[11px] text-muted-foreground font-medium">
                {summary.inProgressTasks} em andamento
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* LISTAGEM DE TAREFAS (Colapsável) */}
      <div className="pb-10 space-y-2">

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

        {/* Fixadas */}
        {pinnedTasks.length > 0 && (
          <details open className="group">
            <SectionHeader title="Fixadas" icon={Pin} colorClass="bg-muted text-foreground" />
            <div className="flex flex-col gap-2 pl-2">
              {pinnedTasks.map(task => (
                <TaskItem key={task.id} task={task} categories={categoryList} allTasks={taskList} />
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

        {/* Estado Vazio */}
        {taskList.filter(t => t.status !== "COMPLETED" && t.status !== "CANCELLED").length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-border rounded-xl mt-8">
            <h3 className="text-base font-bold text-foreground mb-1">Tudo limpo por aqui!</h3>
            <p className="text-muted-foreground text-sm">Você não tem tarefas pendentes. Aproveite o seu dia.</p>
          </div>
        )}

      </div>
    </div>
  );
}