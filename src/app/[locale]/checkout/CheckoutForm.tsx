"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { alterarPlanoAction } from "@/actions/subscription-actions";
import { Button } from "@/components/ui/Button";
import { CreditCard, Lock } from "lucide-react";

export default function CheckoutForm({ planId }: Readonly<{ planId: number }>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSimularPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Simulamos um delay de 2 segundos para dar "realismo" ao gateway de pagamento (opcional)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. Chamamos a sua Action que vai no backend atualizar o plano do usuário
    const res = await alterarPlanoAction(planId);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      // 3. Sucesso! Redireciona o usuário para o dashboard/settings dele
      // Adicionamos ?success=true na URL para você poder mostrar um Toast de sucesso na página de destino
      router.push("/settings?aba=assinatura&success=true");
    }
  };

  return (
    <form onSubmit={handleSimularPagamento} className="space-y-5">
      {/* Nome no Cartão */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase">Nome no Cartão</label>
        <input 
          type="text" 
          required 
          placeholder="Ex: MELKYSEDEKE SILVA" 
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
        />
      </div>

      {/* Número do Cartão */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase">Número do Cartão</label>
        <div className="relative">
          <input 
            type="text" 
            required 
            placeholder="0000 0000 0000 0000" 
            maxLength={19}
            className="w-full bg-background border border-border rounded-lg pl-11 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
          />
          <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Validade e CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Validade</label>
          <input 
            type="text" 
            required 
            placeholder="MM/AA" 
            maxLength={5}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">CVV</label>
          <input 
            type="text" 
            required 
            placeholder="123" 
            maxLength={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      {/* Mensagem de Erro (se houver) */}
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm border border-red-500/20">
          {error}
        </div>
      )}

      {/* Botão de Submit */}
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-6 mt-4 text-base font-bold flex items-center justify-center gap-2"
      >
        {isLoading ? (
          "Processando pagamento..."
        ) : (
          <>
            <Lock size={18} /> Finalizar Assinatura
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
        <Lock size={12} /> Criptografia acadêmica de ponta-a-ponta
      </p>
    </form>
  );
}