import { CheckCircle2 } from "lucide-react";
import { getMinhasCategoriasAction } from "@/actions/category-actions"; 
import { getTasksAction } from "@/actions/task-actions"; // <-- Importando a action de tarefas

interface QuotaUsageCardProps {
  planName: string;
  maxTasks: number;
}

export async function QuotaUsageCard({ planName, maxTasks }: Readonly<QuotaUsageCardProps>) {
  // Executando ambas as requisições em paralelo para não travar a renderização
  const [categorias, tarefas] = await Promise.all([
    getMinhasCategoriasAction(),
    getTasksAction()
  ]);

  // Garantindo que os retornos são arrays antes de tirar o length
  const categoriasUsadas = Array.isArray(categorias) ? categorias.length : 0;
  const tarefasUsadas = Array.isArray(tarefas) ? tarefas.length : 0; 

  const porcentagemTarefas = Math.min((tarefasUsadas / maxTasks) * 100, 100);

  let progressColor = "bg-primary";
  if (porcentagemTarefas >= 100) {
    progressColor = "bg-red-500";
  } else if (porcentagemTarefas >= 80) {
    progressColor = "bg-amber-500";
  }
  
  let maxCategorias = 5; 
  if (planName === "Enterprise") {
    maxCategorias = 999;
  } else if (planName === "Pro") {
    maxCategorias = 20;
  }

  const porcentagemCategorias = Math.min((categoriasUsadas / maxCategorias) * 100, 100);

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-primary" size={20} />
          <h3 className="font-bold text-foreground">Uso de Quota</h3>
        </div>
        
        <div className="space-y-6">
          {/* Quota Dinâmica de Tarefas */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Tarefas Criadas</span>
              <span className="text-muted-foreground font-medium">{tarefasUsadas} / {maxTasks}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div 
                className={`h-full ${progressColor} transition-all duration-500`} 
                style={{ width: `${porcentagemTarefas}%` }} 
              />
            </div>
          </div>
          
          {/* Quota Dinâmica de Categorias */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Categorias</span>
              <span className="text-muted-foreground font-medium">
                {categoriasUsadas} / {maxCategorias === 999 ? "∞" : maxCategorias}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${porcentagemCategorias > 90 ? 'bg-red-500' : 'bg-amber-600'}`} 
                style={{ width: `${porcentagemCategorias}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground italic mt-6">
        Seu plano {planName} permite até {maxTasks} tarefas simultâneas.
      </p>
    </div>
  );
}