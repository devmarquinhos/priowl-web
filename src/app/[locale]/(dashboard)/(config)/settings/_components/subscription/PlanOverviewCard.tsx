import { Button } from "@/components/ui/Button";

interface PlanOverviewCardProps {
  planName: string;
  planPrice: number;
  description: string;
}

export function PlanOverviewCard({ planName, planPrice, description }: PlanOverviewCardProps) {
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(planPrice);

  return (
    <div className="col-span-2 rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block rounded-full bg-orange-200/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Plano Atual
            </span>
            <h2 className="text-3xl font-bold text-foreground mt-4">
              {planName === "Free" ? "Priowl Free" : `Priowl ${planName}`}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {precoFormatado}<span className="text-sm font-normal text-muted-foreground">/mês</span>
            </p>
            {planPrice > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Próxima cobrança:<br/> 31/12/2027
              </p>
            )}
          </div>
        </div>
        
        <p className="max-w-md text-muted-foreground mb-8 text-sm">
          {description || "Gerencie suas tarefas com eficiência."}
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          {planName === "Enterprise" ? "Gerenciar Plano" : "Upgrade para Enterprise"}
        </Button>
        {planPrice > 0 && (
          <Button variant="outline" className="border-border text-foreground">
            Gerenciar Cartão
          </Button>
        )}
      </div>
   </div>
  );
}