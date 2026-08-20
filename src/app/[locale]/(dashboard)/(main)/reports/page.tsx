import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getTasksAction } from "@/actions/task-actions";
import { getMinhasCategoriasAction } from "@/actions/category-actions";

// 🔹 Importação dos componentes isolados
import { TaskOverviewChart } from "./_components/TaskOverviewChart";
import { CategoryProgressCards } from "./_components/CategoryProgressCards";
import type { CategoryStat } from "./_components/CategoryProgressCards";
import { DependencyMap } from "./_components/DependencyMap";

export default async function RelatoriosPage() {
  const [tasks, categories] = await Promise.all([
    getTasksAction(),
    getMinhasCategoriasAction()
  ]);

  const taskList = tasks || [];
  const categoryList = categories || [];

  // 1. Processamento de Categorias
  const rawCategoryStats: CategoryStat[] = categoryList.map(cat => {
    const catTasks = taskList.filter(t => t.categoryId === cat.id && t.status !== "CANCELLED");
    const total = catTasks.length;
    const completed = catTasks.filter(t => t.status === "COMPLETED").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { 
      id: cat.id, 
      title: cat.title, 
      total, 
      completed, 
      progress, 
      pending: total - completed 
    };
  });

  const uncategorizedTasks = taskList.filter(t => !t.categoryId && t.status !== "CANCELLED");
  if (uncategorizedTasks.length > 0) {
    const total = uncategorizedTasks.length;
    const completed = uncategorizedTasks.filter(t => t.status === "COMPLETED").length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    rawCategoryStats.push({
      id: "uncategorized",
      title: "Sem Categoria",
      total,
      completed,
      progress,
      pending: total - completed
    });
  }

  const categoryStats = rawCategoryStats
    .filter(c => c.total > 0) 
    .sort((a, b) => b.total - a.total) 
    .slice(0, 3);

  // 2. Processamento de Dependências
  const blockedTasks = taskList.filter(t => t.parentTaskId && t.status !== "COMPLETED");
  const dependencyChains = blockedTasks.slice(0, 3).map((bottleneck, index) => {
  const parent = taskList.find(t => t.id === bottleneck.parentTaskId);
  const blockedCount = taskList.filter(t => t.parentTaskId === bottleneck.id).length || 3;
    
    return {
      id: `chain-${index}`,
      bottleneck,
      parent,
      blockedCount
    };
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Relatórios e Progresso
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-card text-foreground font-bold shadow-sm h-9 px-3 text-xs">
            <Download size={14} /> Exportar PDF
          </Button>
          <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm h-9 px-3 text-xs">
            <Calendar size={14} /> Últimos 30 dias
          </Button>
        </div>
      </div>

      {/* GRID SUPERIOR */}
      <div className="grid gap-4 xl:grid-cols-3">
        <TaskOverviewChart tasks={taskList} />
        <CategoryProgressCards stats={categoryStats} />
      </div>

      {/* MAPA DE DEPENDÊNCIAS */}
      <DependencyMap chains={dependencyChains} />

    </div>
  );
}