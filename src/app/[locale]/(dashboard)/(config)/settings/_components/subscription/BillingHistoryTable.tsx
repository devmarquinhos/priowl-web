import { Download, Receipt, RotateCcw, ChevronLeft, ChevronRight, FileX2 } from "lucide-react";
import { getMeusPagamentosAction } from "@/actions/subscription-actions";

// 🔹 1. Tipagem esperada do backend
interface PaymentItem {
  id: string | number;
  paymentDate: string; // Ex: "2023-12-01T10:00:00Z"
  amount: number;      // Ex: 29.90
  status: string;      // Ex: "PAID" | "FAILED" | "PENDING"
}

export async function BillingHistoryTable() {
  // 🔹 2. Busca dinâmica das faturas no backend
  const faturas: PaymentItem[] = await getMeusPagamentosAction();

  // Formatador de moeda
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Formatador de data (Ex: "01 Dez, 2023")
  const formatarData = (dataIso: string) => {
    if (!dataIso) return "--";
    const data = new Date(dataIso);
    
    // 🔹 CORREÇÃO: Usando replaceAll para satisfazer o SonarLint
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replaceAll(' de ', ' ').replaceAll('.', ','); 
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-xl font-bold text-foreground">Histórico de Pagamentos</h3>
        <button 
          className="text-primary text-sm font-bold flex items-center gap-2 hover:underline transition-all disabled:opacity-50 disabled:hover:no-underline"
          disabled={faturas.length === 0}
        >
          <Download size={16} /> Exportar Tudo
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/20 text-muted-foreground font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">ID da Fatura</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* 🔹 3. Estado Vazio: Se não houver faturas */}
            {faturas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileX2 size={32} className="text-muted-foreground/50" />
                    <p>Nenhuma fatura encontrada no seu histórico.</p>
                  </div>
                </td>
              </tr>
            ) : (
              /* 🔹 4. Renderização Dinâmica */
              faturas.map((fatura) => {
                const isPago = fatura.status === "PAID" || fatura.status === "Pago";

                return (
                  <tr key={fatura.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">
                      {typeof fatura.id === 'number' ? `INV-${new Date(fatura.paymentDate).getFullYear()}-${fatura.id}` : fatura.id}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{formatarData(fatura.paymentDate)}</td>
                    <td className="px-6 py-4 text-foreground font-medium">{formatarMoeda(fatura.amount)}</td>
                    <td className="px-6 py-4">
                      {isPago ? (
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Pago
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Falhou
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#A17C12]">
                      {/* 🔹 CORREÇÃO: title envelopado no span ao invés do ícone direto */}
                      {isPago ? (
                        <span title="Ver Recibo">
                          <Receipt size={18} className="cursor-pointer hover:opacity-70 transition-opacity" />
                        </span>
                      ) : (
                        <span title="Tentar Novamente">
                          <RotateCcw size={18} className="cursor-pointer hover:opacity-70 transition-opacity" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* 🔹 Paginação condicional */}
      {faturas.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/10 flex justify-between items-center text-sm text-muted-foreground">
          <span>Mostrando {faturas.length} faturas</span>
          <div className="flex items-center gap-1 font-medium">
            <button className="p-1.5 hover:bg-muted rounded text-foreground transition-colors"><ChevronLeft size={16}/></button>
            <button className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center">1</button>
            <button className="p-1.5 hover:bg-muted rounded text-foreground transition-colors"><ChevronRight size={16}/></button>
          </div>
        </div>
      )}
    </div>
  );
}