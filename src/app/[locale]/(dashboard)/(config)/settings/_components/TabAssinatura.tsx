import Link from "next/link";
import { Button } from "@/components/ui/Button"; // Cuidado com o B maiúsculo/minúsculo
import { CheckCircle2, Check, CreditCard, Receipt } from "lucide-react";
import { getMinhaAssinaturaAction, getPlanosAction } from "@/actions/user-actions";

export async function TabAssinatura() {
  // Busca a assinatura e os planos em paralelo
  const [subscription, planos] = await Promise.all([
    getMinhaAssinaturaAction(),
    getPlanosAction()
  ]);

  const planName = subscription?.planName || "Free";
  const maxTasks = subscription?.maxTasks || 5;
  const isFree = planName.toLowerCase().includes("free");
  
  const planoAtualData = planos.find(p => p.name === planName);
  const planPrice = planoAtualData?.price || 0;

  // Formatador de Moeda
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(planPrice);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* --- SEÇÃO: MEU PLANO --- */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
           <div className="mb-4 flex items-start justify-between">
             <div>
               <span className="mb-2 inline-block rounded bg-secondary/15 px-2 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                 Plano Atual
               </span>
               <h2 className="text-3xl font-bold text-foreground">{planName}</h2>
             </div>
             <div className="text-right">
               <p className="text-2xl font-bold text-foreground">
                 {precoFormatado}<span className="text-sm font-normal text-muted">/mês</span>
               </p>
             </div>
           </div>
           <p className="mb-8 max-w-sm text-muted">
             {planoAtualData?.description || "Gerencie suas tarefas com eficiência."}
           </p>
           <div className="flex gap-4">
             {/* REDIRECIONAMENTO PARA A TELA DE PLANOS AQUI */}
             <Link href="/plans">
               <Button className="bg-primary text-white hover:bg-primary/90">
                 {isFree ? "Fazer Upgrade" : "Alterar Plano"}
               </Button>
             </Link>
           </div>
        </div>

        {/* Quota */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-primary" size={20} />
            <h3 className="font-bold text-foreground">Uso de Quota</h3>
          </div>
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">Tarefas Criadas</span>
              <span className="text-muted">2 / {maxTasks}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(2 / maxTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO CONDICIONAL: PLANOS vs PAGAMENTOS --- */}
      {isFree ? (
        /* Renderiza os planos se for conta gratuita */
        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">Faça um Upgrade</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {planos.map((plano) => (
              <div 
                key={plano.id} 
                className={`relative flex flex-col rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-1 ${
                  plano.name === planName 
                    ? "border-primary bg-primary/5" 
                    : "border-border bg-card"
                }`}
              >
                {plano.name === planName && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white whitespace-nowrap">
                    SEU PLANO
                  </span>
                )}
                
                <h4 className="text-xl font-bold text-foreground">{plano.name}</h4>
                <p className="mt-2 text-sm text-muted line-clamp-2 min-h-[40px]">{plano.description}</p>
                
                <div className="my-6">
                  <span className="text-3xl font-bold text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.price)}
                  </span>
                  <span className="text-sm text-muted">/mês</span>
                </div>

                <ul className="mb-8 space-y-3 flex-1">
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <Check size={16} className="text-primary shrink-0" />
                    Até {plano.maxTasks} tarefas simultâneas
                  </li>
                </ul>

                {/* Redirecionamento individual também por garantia */}
                <Link href="/plans" className="w-full">
                  <Button 
                    variant={plano.name === planName ? "outline" : "primary"}
                    className={`w-full ${plano.name === planName ? "border-primary text-primary pointer-events-none" : ""}`}
                    disabled={plano.name === planName}
                  >
                    {plano.name === planName ? "Plano Atual" : "Assinar " + plano.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Renderiza pagamentos se for conta paga (Pro, Enterprise, etc) */
        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">Faturamento e Pagamentos</h3>
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            
            {/* Bloco de Cartão / Próxima Cobrança */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold text-foreground">Próxima cobrança</p>
                  <p className="text-sm text-muted">
                    {precoFormatado} em 16 de Setembro de 2026
                  </p>
                </div>
              </div>
              <Button variant="outline" className="font-semibold">
                Gerenciar Assinatura
              </Button>
            </div>

            {/* Histórico */}
            <div className="p-6 bg-muted/10">
              <div className="flex items-center gap-2 mb-4 text-foreground font-bold">
                <Receipt size={18} />
                <h4>Histórico de Faturas</h4>
              </div>
              <div className="rounded-lg border border-border bg-card text-sm">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="text-muted-foreground">16 de Ago de 2026</span>
                  <span className="font-medium">{precoFormatado}</span>
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">Pago</span>
                </div>
                <div className="p-4 text-center text-muted-foreground text-xs">
                  Para ver faturas mais antigas, acesse o painel de gerenciamento.
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}