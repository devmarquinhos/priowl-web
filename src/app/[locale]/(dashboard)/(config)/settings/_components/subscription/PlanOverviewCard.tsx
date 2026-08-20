"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cancelarAssinaturaAction } from "@/actions/subscription-actions";

interface PlanOverviewCardProps {
  planName: string;
  planPrice: number;
  description: string;
  isFree: boolean;
  status: string;
  nextBillingDate: string;
}

export function PlanOverviewCard({ 
  planName, 
  planPrice, 
  description, 
  isFree, 
  status, 
  nextBillingDate 
}: Readonly<PlanOverviewCardProps>) {
  
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(planPrice);

  // 🔹 CORREÇÃO: Só consideramos cancelado se NÃO for o plano Free
  const isCancelado = status === "CANCELLED" && !isFree;
  
  const statusBadgeColor = isCancelado 
    ? "bg-red-100 text-red-700" 
    : "bg-green-100 text-green-700";

  // Função para simular o gerenciamento do cartão
  const handleGerenciarCartao = () => {
    alert("Ambiente Ilustrativo: Como este é um projeto acadêmico, nenhum dado real de cartão é armazenado.");
  };

  // Função real que chama o backend para cancelar a assinatura
  const handleCancelarAssinatura = async () => {
    const confirmacao = window.confirm("Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso aos recursos premium no próximo ciclo.");
    if (!confirmacao) return;

    setIsCanceling(true);
    const res = await cancelarAssinaturaAction();
    
    if (res?.error) {
      alert(res.error);
      setIsCanceling(false);
    } else {
      router.refresh(); 
      setIsCanceling(false);
    }
  };

  return (
    <div className="col-span-2 rounded-xl border border-border bg-card p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-orange-200/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                Plano Atual
              </span>
              
              {/* Badge de Status (Não mostra para usuários Free) */}
              {!isFree && (
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeColor}`}>
                  {isCancelado ? "Cancelado" : "Ativo"}
                </span>
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mt-4">
              {planName === "Free" ? "Priowl Free" : `Priowl ${planName}`}
            </h2>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {precoFormatado}<span className="text-sm font-normal text-muted-foreground">/mês</span>
            </p>
            {/* Próxima cobrança só aparece se for pago e ativo */}
            {!isFree && !isCancelado && (
              <p className="text-xs text-muted-foreground mt-1">
                Próxima cobrança:<br/> {nextBillingDate}
              </p>
            )}
          </div>
        </div>
        
        <p className="max-w-md text-muted-foreground mb-6 text-sm">
          {description || "Gerencie suas tarefas com eficiência."}
        </p>

        {/* Método de Pagamento - Só aparece para quem tem plano pago ativo */}
        {!isFree && !isCancelado && (
          <div className="flex items-center gap-3 mb-8 p-3 rounded-lg border border-border bg-muted/20 w-max">
            <CreditCard size={18} className="text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Mastercard terminado em •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expira em 10/2028</p>
            </div>
          </div>
        )}

        {/* Aviso de Cancelamento */}
        {isCancelado && (
          <div className="flex items-start gap-2 mb-8 p-3 rounded-lg border border-red-200 bg-red-50 text-red-800 w-max max-w-full">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="text-xs">
              Sua assinatura foi cancelada, mas você ainda tem acesso aos recursos até o fim do período já pago.
            </p>
          </div>
        )}
      </div>
      
      {/* Botões Dinâmicos */}
      <div className="flex flex-wrap items-center gap-4">
        {isFree ? (
          <Link href="/plans">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Fazer Upgrade Agora
            </Button>
          </Link>
        ) : (
          <>
            {isCancelado ? (
              <Link href="/plans">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Retornar para o Free
                </Button>
              </Link>
            ) : (
              <Link href="/plans">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Alterar Plano
                </Button>
              </Link>
            )}
            
            <Button 
              variant="outline" 
              className="border-border text-foreground"
              onClick={handleGerenciarCartao}
            >
              Gerenciar Cartão
            </Button>

            {!isCancelado && (
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
                onClick={handleCancelarAssinatura}
                disabled={isCanceling}
              >
                {isCanceling ? "Cancelando..." : "Cancelar Assinatura"}
              </Button>
            )}
          </>
        )}
      </div>
   </div>
  );
}