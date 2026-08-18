"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { alterarPlanoAction } from "@/actions/subscription-actions";
import { Loader2 } from "lucide-react";

interface PlanActionButtonProps {
  planId: number;
  planName: string;
  isCurrentPlan: boolean;
  isFreeAccount: boolean;
}

export function PlanActionButton({ planId, planName, isCurrentPlan, isFreeAccount }: PlanActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);

    if (isFreeAccount) {
      // 💡 TRUQUE PARA TESTE: Ao invés de ir para o gateway falso, 
      // forçamos o upgrade direto usando a rota de alteração de plano!
      const confirm = window.confirm(`Deseja assinar o plano ${planName} (Modo de Teste)?`);
      if (!confirm) {
        setIsLoading(false);
        return;
      }

      const result = await alterarPlanoAction(planId);
      if (result.success) {
        window.location.reload(); // Força a tela a renderizar o novo plano
      } else {
        alert(result.error || "Erro ao assinar o plano.");
        setIsLoading(false);
      }
    } else {
      // Já possui plano: Upgrade/Downgrade direto
      const confirm = window.confirm(`Deseja alterar seu plano para o ${planName}?`);
      if (!confirm) {
        setIsLoading(false);
        return;
      }

      const result = await alterarPlanoAction(planId);
      if (result.success) {
        window.location.reload(); // Força a atualização dos dados na tela
      } else {
        alert(result.error || "Erro ao alterar o plano.");
        setIsLoading(false);
      }
    }
  };

  if (isCurrentPlan) {
    return (
      <Button variant="outline" className="w-full border-primary text-primary pointer-events-none" disabled>
        Plano Atual
      </Button>
    );
  }

  return (
    <Button onClick={handleAction} disabled={isLoading} className="w-full bg-primary text-white hover:bg-primary/90">
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? "Processando..." : `Assinar ${planName}`}
    </Button>
  );
}