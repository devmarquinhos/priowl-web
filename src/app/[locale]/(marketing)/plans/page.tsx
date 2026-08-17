import { getPlanosAction } from "@/actions/user-actions";
import { Button } from "@/components/ui/Button";
import { Check, ShieldCheck, Clock } from "lucide-react";
import { cookies } from "next/headers"; // 1. Adicionado o import de cookies

export default async function PlanosPage() {
  // 2. Verificação de autenticação no servidor
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("priowl_token")?.value;
  
  const planos = await getPlanosAction();

  return (
    <main className="min-h-screen bg-background pb-20">
      
      {/* Cabeçalho da Página */}
      <section className="pt-20 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Planos e Preços
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Escolha o plano ideal para sua produtividade. De indivíduos a grandes corporações, temos a estrutura certa para o seu fluxo de trabalho.
        </p>
      </section>

      {/* Grid de Planos Dinâmicos - Mais compacto */}
      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {planos.map((plano) => {
          const isRecomendado = plano.name.toLowerCase().includes("pro");
          const precoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.price);

          return (
            <div 
              key={plano.id} 
              className={`relative flex flex-col bg-card rounded-xl p-6 border-2 transition-transform hover:-translate-y-1 ${
                isRecomendado ? "border-primary shadow-lg" : "border-border shadow-sm"
              }`}
            >
              {isRecomendado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                  Recomendado
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-1">{plano.name}</h3>
              
              <div className="mb-3">
                <span className="text-3xl font-extrabold text-primary">{precoFormatado}</span>
                <span className="text-muted-foreground text-xs font-medium">/mês</span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-6 min-h-[32px]">
                {plano.description}
              </p>

              <div className="mb-6 flex-1">
                <p className="font-bold text-sm text-foreground mb-3">
                  {plano.maxTasks >= 9999 ? "Tarefas Ilimitadas" : `Até ${plano.maxTasks} tarefas`}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Categorias personalizadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>Relatórios {isRecomendado || plano.price > 0 ? "avançados" : "básicos"}</span>
                  </li>
                  <li className={`flex items-start gap-2 text-xs ${isRecomendado || plano.price > 0 ? "text-muted-foreground" : "text-muted/50"}`}>
                    <Check size={16} className={isRecomendado || plano.price > 0 ? "text-primary shrink-0" : "text-muted/50 shrink-0"} />
                    <span>Prioridade Automática: {isRecomendado || plano.price > 0 ? "Verdadeiro" : "Falso"}</span>
                  </li>
                </ul>
              </div>

              {/* 3. Renderização Condicional do Botão */}
              {isLoggedIn && (
                <Button 
                    variant={isRecomendado ? "primary" : "outline"}
                    className={`w-full py-4 font-bold text-sm ${
                    isRecomendado ? "bg-primary hover:bg-primary/90 text-white" : "border-primary text-primary hover:bg-primary/5"
                  }`}
                >
                  Escolher Plano
                </Button>
              )}
            </div>
          );
        })}
      </section>

      {/* Seção Bottom - Precisando de algo específico? */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="bg-secondary/10 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center border border-border">
          <div className="p-8 md:p-10 flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-3">Precisando de algo específico?</h2>
            <p className="text-muted-foreground mb-6 text-base">
              Se a sua empresa possui necessidades únicas ou fluxos de trabalho complexos, nossa equipe de engenharia pode criar uma solução sob medida.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="text-primary" size={18} /> Segurança de Dados
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Clock className="text-primary" size={18} /> 99.9% Uptime
              </div>
            </div>
          </div>
          <div className="flex-1 w-full md:w-auto">
            <div className="bg-muted h-56 md:h-full w-full min-h-[250px] relative">
               {/* <Image src="/reuniao.jpg" fill className="object-cover" alt="Equipe em reunião" /> */}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}