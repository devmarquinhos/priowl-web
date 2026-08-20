"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
  UserPlus,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { getAdminPaymentsAction } from "@/actions/admin-actions";

interface Transaction {
  id: string;
  transactionId: string;
  clientName: string;
  clientInitials: string;
  date: string;
  status: "success" | "pending" | "failed";
  statusLabel: string;
  amount: string;
}

interface RawPayment {
  id: number | string;
  transactionId?: string;
  codigo?: string;
  clientName?: string;
  cliente?: string;
  userName?: string;
  date?: string;
  createdAt?: string;
  created_at?: string;
  status?: string;
  amount?: number | string;
  valor?: number | string;
}

interface ActivityLog {
  id: string;
  title: string;
  timeInfo: string;
  barColor: string;
}

const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "1",
    title: "Upgrade de Plano - Ricardo Mendes",
    timeInfo: "Hoje, 10:45 • Admin: Sistema Automático",
    barColor: "bg-[#735613]",
  },
  {
    id: "2",
    title: "Reembolso Processado - ID #RX-029",
    timeInfo: "Hoje, 09:12 • Admin: Marcos Silva",
    barColor: "bg-[#a84325]",
  },
  {
    id: "3",
    title: "Novo Método de Pagamento Adicionado",
    timeInfo: "Ontem, 18:20 • Cliente: Ana Souza",
    barColor: "bg-gray-400",
  },
];

export default function AdminBillingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      const result = await getAdminPaymentsAction();

      if (result.error) {
        setErrorMsg(result.error);
      } else if (result.success && Array.isArray(result.data)) {
        const mapped = (result.data as RawPayment[]).map((p, index) => {
          const rawStatus = (p.status || "").toLowerCase();
          let status: Transaction["status"] = "success";
          let statusLabel = "Sucesso";

          if (rawStatus.includes("pend") || rawStatus === "pending") {
            status = "pending";
            statusLabel = "Pendente";
          } else if (rawStatus.includes("falha") || rawStatus.includes("cancel") || rawStatus === "failed") {
            status = "failed";
            statusLabel = "Falha";
          }

          const rawName = p.clientName ?? p.cliente ?? p.userName ?? "Cliente Priowl";
          const initials = rawName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

          const rawAmount = p.amount ?? p.valor;
          const formattedAmount =
            typeof rawAmount === "number" ? `R$ ${rawAmount.toFixed(2).replace(".", ",")}` : String(rawAmount || "R$ 0,00");

          const rawDate = p.date ?? p.createdAt ?? p.created_at;
          const formattedDate = rawDate
            ? new Date(rawDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
            : "24 Jan, 2024";

          return {
            id: String(p.id || index),
            transactionId: p.transactionId ?? p.codigo ?? `#TX-984${21 - index}`,
            clientName: rawName,
            clientInitials: initials,
            date: formattedDate,
            status,
            statusLabel,
            amount: formattedAmount,
          };
        });

        setTransactions(mapped);
      }
      setIsLoading(false);
    };

    fetchPayments();
  }, []);

  const getAvatarBg = (index: number) => {
    const colors = [
      "bg-[#e8d5b5] text-[#5e440d]",
      "bg-[#f0e3a5] text-[#6e5808]",
      "bg-gray-200 text-gray-700",
      "bg-[#fcd2c2] text-[#822a0c]",
    ];
    return colors[index % colors.length];
  };

  const getStatusBadgeStyle = (status: Transaction["status"]) => {
    if (status === "success") {
      return "bg-[#fef7e6] text-[#8c6b23] border border-[#8c6b23]/20";
    }
    if (status === "pending") {
      return "bg-gray-100 text-gray-600 border border-gray-200";
    }
    return "bg-red-50 text-red-600 border border-red-100";
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center text-[#8c6b23]">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-sm">Carregando histórico de transações...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (errorMsg) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-12 text-center text-red-500 font-medium bg-red-50/50">
            {errorMsg}
          </td>
        </tr>
      );
    }

    if (transactions.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
            Nenhuma transação encontrada.
          </td>
        </tr>
      );
    }

    return transactions.map((item, index) => (
      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
        <td className="px-6 py-4 font-semibold text-[#8c6b23]">{item.transactionId}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarBg(index)}`}>
              {item.clientInitials}
            </div>
            <span className="font-medium text-gray-900">{item.clientName}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-500">{item.date}</td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(item.status)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {item.statusLabel}
          </span>
        </td>
        <td className="px-6 py-4 font-bold text-gray-900">{item.amount}</td>
        <td className="px-6 py-4 text-right">
          <button type="button" className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <MoreVertical size={16} />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Faturamento & Transações
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie o histórico financeiro e fluxos de receita da Priowl.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Calendar size={14} className="text-gray-500" />
            <span>01 Jan, 2024 - 31 Jan, 2024</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 bg-[#735613] hover:bg-[#5e440d] text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Download size={14} />
            <span>Exportar para CSV</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
            RECEITA TOTAL (MÊS)
          </span>
          <div className="mt-3">
            <span className="text-2xl font-black text-gray-900">R$ 142.500,00</span>
            <div className="flex items-center gap-1 text-xs text-[#735613] font-medium mt-1">
              <TrendingUp size={12} />
              <span>+12.5% vs mês passado</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
            ASSINATURAS ATIVAS
          </span>
          <div className="mt-3">
            <span className="text-2xl font-black text-gray-900">1.284</span>
            <div className="flex items-center gap-1 text-xs text-[#735613] font-medium mt-1">
              <UserPlus size={12} />
              <span>+48 novos este mês</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
            TICKET MÉDIO
          </span>
          <div className="mt-3">
            <span className="text-2xl font-black text-gray-900">R$ 110,98</span>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
              <Minus size={12} />
              <span>Estável</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">
            TAXA DE FALHA
          </span>
          <div className="mt-3">
            <span className="text-2xl font-black text-gray-900">1.8%</span>
            <div className="flex items-center gap-1 text-xs text-red-600 font-medium mt-1">
              <AlertTriangle size={12} />
              <span>-0.2% melhoria</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">ID DA TRANSAÇÃO</th>
                <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">CLIENTE</th>
                <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">DATA</th>
                <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3.5 font-semibold uppercase tracking-wider">VALOR PAGO</th>
                <th className="px-6 py-3.5 font-semibold uppercase tracking-wider text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">{renderTableBody()}</tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>
            Mostrando <strong className="text-gray-900">1 - 5</strong> de <strong className="text-gray-900">1,248</strong> transações
          </span>

          <div className="flex items-center gap-1">
            <button type="button" className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-400">
              <ChevronLeft size={14} />
            </button>
            <button type="button" className="w-7 h-7 rounded bg-[#735613] text-white font-bold flex items-center justify-center">
              1
            </button>
            <button type="button" className="w-7 h-7 rounded hover:bg-gray-100 font-medium flex items-center justify-center">
              2
            </button>
            <button type="button" className="w-7 h-7 rounded hover:bg-gray-100 font-medium flex items-center justify-center">
              3
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button type="button" className="w-7 h-7 rounded hover:bg-gray-100 font-medium flex items-center justify-center">
              250
            </button>
            <button type="button" className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Seção Inferior: Logs e Banner de Relatórios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Log de Atividades Recentes */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Log de Atividades Recentes</h3>
              <button type="button" className="text-xs font-semibold text-[#735613] hover:underline">
                Ver Todos
              </button>
            </div>

            <div className="space-y-4">
              {ACTIVITY_LOGS.map((log) => (
                <div key={log.id} className="flex items-center gap-3">
                  <div className={`w-1 h-9 rounded-full ${log.barColor} shrink-0`} />
                  <div>
                    <p className="text-xs font-bold text-gray-900">{log.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{log.timeInfo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Banner Relatórios Customizados */}
        <div className="lg:col-span-5 bg-[#733d13] text-white rounded-xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-xs">
            <h3 className="text-xl font-bold mb-2 leading-tight">Relatórios Customizados</h3>
            <p className="text-xs text-amber-100/80 leading-relaxed mb-6">
              Precisa de uma análise detalhada para sua diretoria? Gere relatórios financeiros complexos em minutos.
            </p>
            <button
              type="button"
              className="bg-white hover:bg-amber-50 text-[#733d13] text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              Solicitar Relatório
            </button>
          </div>

          {/* Marca d'água de fundo */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-[12px] border-white/10 rounded-2xl pointer-events-none transform rotate-12" />
        </div>
      </div>
    </div>
  );
}