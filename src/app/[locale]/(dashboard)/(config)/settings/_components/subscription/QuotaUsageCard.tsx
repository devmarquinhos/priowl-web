import { CheckCircle2 } from "lucide-react";

interface QuotaUsageCardProps {
  planName: string;
  maxTasks: number;
}

export function QuotaUsageCard({ planName, maxTasks }: QuotaUsageCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-primary" size={20} />
          <h3 className="font-bold text-foreground">Uso de Quota</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Tarefas Criadas</span>
              <span className="text-muted-foreground font-medium">1.240 / {maxTasks}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '25%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Armazenamento</span>
              <span className="text-muted-foreground font-medium">4.2 GB / 10 GB</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-800" style={{ width: '42%' }}></div>
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