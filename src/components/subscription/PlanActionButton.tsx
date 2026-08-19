"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { alterarPlanoAction, cancelarAssinaturaAction } from "@/actions/subscription-actions"; // 🔹 Adicionado o cancelar
import { Loader2 } from "lucide-react";

interface PlanActionButtonProps {
  planId: number;
  planName: string;
  isCurrentPlan: boolean;
  isFreeAccount: boolean;
}

export function PlanActionButton({ planId, planName, isCurrentPlan, isFreeAccount }: Readonly<PlanActionButtonProps>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);

    if (planName.toLowerCase() === "free" || planName.toLowerCase() === "gratuito") {
      const confirm = window.confirm(`Deseja retornar ao plano ${planName}? Você perderá os recursos Premium no próximo ciclo.`);
      if (!confirm) {
        setIsLoading(false);
        return;
      }

      const result = await cancelarAssinaturaAction();
      
      if (result?.error) {
        alert(result.error);
        setIsLoading(false);
      } else {
        window.location.reload();
      }
      
      return;
    }

    if (isFreeAccount) {
      const confirm = window.confirm(`Deseja assinar o plano ${planName} (Modo de Teste)?`);
      if (!confirm) {
        setIsLoading(false);
        return;
      }

      const result = await alterarPlanoAction(planId);
      if (result.success) {
        window.location.reload(); 
      } else {
        alert(result.error || "Erro ao assinar o plano.");
        setIsLoading(false);
      }
    } else {
      const confirm = window.confirm(`Deseja alterar seu plano para o ${planName}?`);
      if (!confirm) {
        setIsLoading(false);
        return;
      }

      const result = await alterarPlanoAction(planId);
      if (result.success) {
        window.location.reload(); 
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
      {isLoading ? "Processando..." : (planName.toLowerCase() === "free" ? "Retornar ao Free" : `Assinar ${planName}`)}
    </Button>
  );
}