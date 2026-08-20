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
  const isFree = planName === "Free";
  const planoAtualData = planos.find((p: PlanItem) => p.name.toLowerCase() === planName.toLowerCase());
  const planPrice = planoAtualData?.price || 0;

  const statusAssinatura = subscription?.status || "ACTIVE";
  
  let nextBillingDate = "31/12/2027";
  if (subscription?.endDate) {
    nextBillingDate = new Date(subscription.endDate).toLocaleDateString('pt-BR');
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Cards superiores */}
      <div className="grid gap-6 md:grid-cols-3">
        <PlanOverviewCard 
          planName={planName} 
          planPrice={planPrice} 
          description={planoAtualData?.description || ""} 
          isFree={isFree}                     // 🔹 Nova prop
          status={statusAssinatura}           // 🔹 Nova prop
          nextBillingDate={nextBillingDate}   // 🔹 Nova prop
        />
        <QuotaUsageCard 
          planName={planName} 
          maxTasks={maxTasks} 
        />
      </div>

      {/* 2. Histórico de Pagamentos (Exibido apenas para usuários pagantes) */}
      {!isFree && (
        <BillingHistoryTable />
      )}

      {/* 3. Banners */}
      <PromotionalBanners />

    </div>
  );
}