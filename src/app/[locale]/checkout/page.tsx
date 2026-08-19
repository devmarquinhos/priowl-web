import { getPlanosAction } from "@/actions/subscription-actions";
import { redirect } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CheckoutForm from "./CheckoutForm";

// No Next.js, recebemos searchParams pela props da página
export default async function CheckoutPage({
  searchParams,
}: Readonly<{
  searchParams: { planoId?: string };
}>) {
  const params = await searchParams; // Necessário no Next.js 15+ (ou opcional no 14)
  const planoId = params.planoId;

  if (!planoId) {
    redirect("/plans"); // Se acessar direto sem ID, volta pros planos
  }

  // Buscamos os planos e filtramos o que o usuário escolheu
  const planos = await getPlanosAction();
  const planoSelecionado = planos.find((p) => p.id === Number(planoId));

  if (!planoSelecionado) {
    redirect("/plans");
  }

  const precoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(planoSelecionado.price);

  return (
    <main className="min-h-screen bg-muted/30 py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full mb-4">
        <Link 
          href="/plans" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para os planos
        </Link>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
        
        {/* LADO ESQUERDO - Formulário de Pagamento (Client Component) */}
        <div className="p-8 md:p-12 order-2 md:order-1">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Pagamento</h2>
          <CheckoutForm planId={planoSelecionado.id} />
        </div>

        {/* LADO DIREITO - Resumo do Pedido */}
        <div className="bg-primary/5 p-8 md:p-12 border-l border-border order-1 md:order-2 flex flex-col">
          <p className="text-sm font-bold text-primary mb-1">Resumo do Pedido</p>
          <h2 className="text-3xl font-extrabold text-foreground mb-6">
            Plano {planoSelecionado.name}
          </h2>

          <div className="flex items-end gap-2 mb-6 border-b border-border/50 pb-6">
            <span className="text-5xl font-black text-foreground">{precoFormatado}</span>
            <span className="text-muted-foreground font-medium mb-2">/mês</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Você terá acesso imediato aos seguintes benefícios:
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-foreground">
              <div className="bg-primary/20 p-1 rounded-full"><Check size={14} className="text-primary"/></div>
              Até {planoSelecionado.maxTasks >= 9999 ? "Infinitas" : planoSelecionado.maxTasks} tarefas
            </li>
            <li className="flex items-center gap-3 text-sm text-foreground">
              <div className="bg-primary/20 p-1 rounded-full"><Check size={14} className="text-primary"/></div>
              Categorias personalizadas
            </li>
            <li className="flex items-center gap-3 text-sm text-foreground">
              <div className="bg-primary/20 p-1 rounded-full"><Check size={14} className="text-primary"/></div>
              Relatórios e Métricas
            </li>
          </ul>

          <div className="bg-background p-4 rounded-xl border border-border text-xs text-muted-foreground">
            <strong>Nota Acadêmica:</strong> Este é um ambiente ilustrativo. Nenhum valor real será cobrado e os dados do cartão não são validados.
          </div>
        </div>
      </div>
    </main>
  );
}