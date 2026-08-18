import { getMinhaAssinaturaAction, getPlanosAction } from "@/actions/subscription-actions";
import { PlanOverviewCard } from "./subscription/PlanOverviewCard";
import { QuotaUsageCard } from "./subscription/QuotaUsageCard";
import { BillingHistoryTable } from "./subscription/BillingHistoryTable";
import { PromotionalBanners } from "./subscription/PromotionalBanners";

interface PlanItem {
  id: number;
  name: string;
  description: string;
  price: number;
  maxTasks: number;
  isActive: boolean;
}

export async function TabAssinatura() {
  const [subscription, planos] = await Promise.all([
    getMinhaAssinaturaAction(),
    getPlanosAction() as Promise<PlanItem[]>
  ]);

  let planName = subscription?.planName || "Free";
  if (planName.toLowerCase().includes("free")) planName = "Free";

  const maxTasks = subscription?.maxTasks || 5;
  const planoAtualData = planos.find((p: PlanItem) => p.name.toLowerCase() === planName.toLowerCase());
  const planPrice = planoAtualData?.price || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Cards superiores */}
      <div className="grid gap-6 md:grid-cols-3">
        <PlanOverviewCard 
          planName={planName} 
          planPrice={planPrice} 
          description={planoAtualData?.description || ""} 
        />
        <QuotaUsageCard 
          planName={planName} 
          maxTasks={maxTasks} 
        />
      </div>

      {/* 2. Histórico de Pagamentos */}
      <BillingHistoryTable />

      {/* 3. Banners */}
      <PromotionalBanners />

    </div>
  );
}