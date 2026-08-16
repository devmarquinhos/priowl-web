import { Button } from "@/components/ui/Button";
import { CheckCircle2, Download, FileText, RefreshCw, ChevronRight, Users, Medal } from "lucide-react";

export function TabAssinatura() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Plano Atual */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
           <div className="mb-4 flex items-start justify-between">
             <div>
               <span className="mb-2 inline-block rounded bg-secondary/15 px-2 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                 Plano Atual
               </span>
               <h2 className="text-3xl font-bold text-foreground">Priowl Pro</h2>
             </div>
             <div className="text-right">
               <p className="text-2xl font-bold text-foreground">
                 R$ 29,90<span className="text-sm font-normal text-muted">/mês</span>
               </p>
               <p className="text-xs text-muted">Próxima cobrança: 31/12/2027</p>
             </div>
           </div>
           <p className="mb-8 max-w-sm text-muted">Gerencie suas tarefas com recursos ilimitados e suporte prioritário.</p>
           <div className="flex gap-4">
             <Button className="bg-primary text-white hover:bg-primary-hover">Upgrade para Enterprise</Button>
             <Button variant="outline" className="border-border text-foreground hover:bg-background">Gerenciar Cartão</Button>
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
              <span className="text-muted">1.240 / 5.000</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border">
              <div className="h-2 w-1/4 rounded-full bg-primary"></div>
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">Armazenamento</span>
              <span className="text-muted">4.2 GB / 10 GB</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border">
              <div className="h-2 w-[42%] rounded-full bg-secondary"></div>
            </div>
          </div>

          <p className="text-xs italic text-muted">Seu plano Pro permite até 5.000 tarefas simultâneas.</p>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h3 className="text-xl font-bold text-foreground">Histórico de Pagamentos</h3>
          <Button variant="ghost" className="flex items-center gap-2 text-primary hover:bg-primary/10">
            <Download size={16} /> Exportar Tudo
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-background text-xs font-medium uppercase text-muted">
              <tr>
                <th className="px-6 py-4">ID da Fatura</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { id: "INV-2023-8942", date: "01 Dez, 2023", value: "R$ 29,90", status: "Pago", ok: true },
                { id: "INV-2023-8120", date: "01 Nov, 2023", value: "R$ 29,90", status: "Pago", ok: true },
                { id: "INV-2023-7431", date: "01 Out, 2023", value: "R$ 29,90", status: "Falhou", ok: false },
                { id: "INV-2023-6890", date: "01 Set, 2023", value: "R$ 29,90", status: "Pago", ok: true },
              ].map((invoice) => (
                <tr key={invoice.id} className="hover:bg-background/50">
                  <td className="px-6 py-4 font-medium">{invoice.id}</td>
                  <td className="px-6 py-4">{invoice.date}</td>
                  <td className="px-6 py-4">{invoice.value}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      invoice.ok ? "bg-green-500/10 text-green-600" : "bg-error/10 text-error"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${invoice.ok ? "bg-green-500" : "bg-error"}`}></span>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted hover:text-primary transition-colors">
                      {invoice.ok ? <FileText size={18} /> : <RefreshCw size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-background p-4">
          <span className="text-sm text-muted">Mostrando 4 de 48 faturas</span>
          <div className="flex items-center gap-1">
             <button className="p-1 text-muted hover:text-foreground"><ChevronRight className="rotate-180" size={18}/></button>
             <button className="h-8 w-8 rounded bg-primary text-sm font-medium text-white">1</button>
             <button className="h-8 w-8 rounded text-sm font-medium text-foreground hover:bg-border/50">2</button>
             <button className="h-8 w-8 rounded text-sm font-medium text-foreground hover:bg-border/50">3</button>
             <button className="p-1 text-muted hover:text-foreground"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* Cards Promocionais */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Medal size={24} />
          </div>
          <div>
            <h4 className="font-bold text-primary">Ganhe 2 meses grátis</h4>
            <p className="mb-2 mt-1 text-sm text-primary/80">Altere para cobrança anual e economize até 17% no valor total do plano Pro.</p>
            <a href="#" className="text-sm font-bold text-primary hover:underline">Mudar para Anual</a>
          </div>
        </div>
        
        <div className="flex gap-4 rounded-xl border border-border bg-background p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tertiary text-white">
            <Users size={24} />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Programa de Indicação</h4>
            <p className="mb-2 mt-1 text-sm text-muted">Convide amigos para o Priowl e receba créditos na sua próxima fatura.</p>
            <a href="#" className="text-sm font-bold text-primary hover:underline">Indicar agora</a>
          </div>
        </div>
      </div>
    </div>
  );
}