import { Download, Receipt, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

const faturasMock = [
  { id: "INV-2023-8942", data: "01 Dez, 2023", valor: "R$ 29,90", status: "Pago" },
  { id: "INV-2023-8120", data: "01 Nov, 2023", valor: "R$ 29,90", status: "Pago" },
  { id: "INV-2023-7431", data: "01 Out, 2023", valor: "R$ 29,90", status: "Falhou" },
  { id: "INV-2023-6890", data: "01 Set, 2023", valor: "R$ 29,90", status: "Pago" },
];

export function BillingHistoryTable() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-xl font-bold text-foreground">Histórico de Pagamentos</h3>
        <button className="text-primary text-sm font-bold flex items-center gap-2 hover:underline transition-all">
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
            {faturasMock.map((fatura) => (
              <tr key={fatura.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4 font-bold text-foreground">{fatura.id}</td>
                <td className="px-6 py-4 text-muted-foreground">{fatura.data}</td>
                <td className="px-6 py-4 text-foreground font-medium">{fatura.valor}</td>
                <td className="px-6 py-4">
                  {fatura.status === "Pago" ? (
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
                  {fatura.status === "Pago" ? (
                    <Receipt size={18} className="cursor-pointer hover:opacity-70 transition-opacity" />
                  ) : (
                    <RotateCcw size={18} className="cursor-pointer hover:opacity-70 transition-opacity" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-border bg-muted/10 flex justify-between items-center text-sm text-muted-foreground">
        <span>Mostrando 4 de 48 faturas</span>
        <div className="flex items-center gap-1 font-medium">
          <button className="p-1.5 hover:bg-muted rounded text-foreground transition-colors"><ChevronLeft size={16}/></button>
          <button className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded hover:bg-muted text-foreground flex items-center justify-center transition-colors">2</button>
          <button className="w-8 h-8 rounded hover:bg-muted text-foreground flex items-center justify-center transition-colors">3</button>
          <button className="p-1.5 hover:bg-muted rounded text-foreground transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  );
}