import { Award, Users } from "lucide-react";

export function PromotionalBanners() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-yellow-200/60 bg-amber-50/50 p-6 flex gap-5 shadow-sm">
        <div className="bg-[#A17C12] text-white p-3 rounded-xl h-max shadow-sm">
          <Award size={24} />
        </div>
        <div>
          <h4 className="font-bold text-[#7A5C0A]">Ganhe 2 meses grátis</h4>
          <p className="text-sm text-[#8A6A0F]/80 mt-1 mb-4 leading-relaxed">
            Altere para cobrança anual e economize até 17% no valor total do plano Pro.
          </p>
          <button className="text-sm font-bold text-[#A17C12] hover:underline transition-all">
            Mudar para Anual
          </button>
        </div>
      </div>
      
      <div className="rounded-xl border border-border bg-muted/30 p-6 flex gap-5 shadow-sm">
        <div className="bg-[#4A4A4A] text-white p-3 rounded-xl h-max shadow-sm">
          <Users size={24} />
        </div>
        <div>
          <h4 className="font-bold text-foreground">Programa de Indicação</h4>
          <p className="text-sm text-muted-foreground mt-1 mb-4 leading-relaxed">
            Convide amigos para o Priowl e receba créditos na sua próxima fatura.
          </p>
          <button className="text-sm font-bold text-[#A17C12] hover:underline transition-all">
            Indicar agora
          </button>
        </div>
      </div>
    </div>
  );
}