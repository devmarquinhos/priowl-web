"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cancelarAssinaturaAction } from "@/actions/subscription-actions";
import { Loader2 } from "lucide-react";

export function CancelSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    const confirm = window.confirm(
      "Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso aos benefícios exclusivos."
    );
    if (!confirm) return;

    setIsLoading(true);
    const result = await cancelarAssinaturaAction();

    if (result.success) {
      alert("Assinatura cancelada com sucesso.");
      window.location.reload();
    } else {
      alert(result.error || "Erro ao cancelar assinatura.");
      setIsLoading(false);
    }
  };

  return (
    <Button variant="danger" onClick={handleCancel} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? "Cancelando..." : "Cancelar Assinatura"}
    </Button>
  );
}