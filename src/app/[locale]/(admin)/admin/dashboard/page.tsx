"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  PlaySquare,
  Calendar,
  Download,
  TrendingUp,
  UserPlus,
  CheckCircle2,
  Settings,
  Loader2,
} from "lucide-react";
import { getAdminKpisAction } from "@/actions/admin-actions";

interface KpiData {
  totalUsers: string;
  usersTrend: string;
  activeSubscriptions: string;
  subscriptionsTrend: string;
  mrr: string;
  mrrTrend: string;
}

interface RawKpiResponse {
  totalUsers?: number | string;
  usersTrend?: string;
  activeSubscriptions?: number | string;
  subscriptionsTrend?: string;
  mrr?: number | string;
  mrrTrend?: string;
}

interface ActivityItem {
  id: string;
  type: "user" | "payment" | "system";
  title: string;
  subtitle: string;
  time: string;
  tag: string;
  tagType: "gold" | "pro" | "success" | "neutral";
}

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "user",
    title: "Novo usuário registrado: Ricardo Santos",
    subtitle: "rsantos@exemplo.com.br",
    time: "Agora mesmo",
    tag: "Plano Pro",
    tagType: "pro",
  },
  {
    id: "2",
    type: "payment",
    title: "Pagamento Processado: #PRW-9821",
    subtitle: "Valor: R$ 499,00",
    time: "Há 12 min",
    tag: "SUCESSO",
    tagType: "success",
  },
  {
    id: "3",
    type: "system",
    title: "Alteração de Configuração: Limite de API",
    subtitle: "Modificado por Admin (Maria Clara)",
    time: "Há 2 horas",
    tag: "Sistema",
    tagType: "neutral",
  },
  {
    id: "4",
    type: "user",
    title: "Novo usuário registrado: Beatriz Oliveira",
    subtitle: "bea.oliveira@empresa.pt",
    time: "Há 4 horas",
    tag: "Plano Gold",
    tagType: "gold",
  },
];

const renderActivityTag = (tag: string, tagType: ActivityItem["tagType"]) => {
  if (tagType === "gold") {
    return <span className="text-xs font-bold text-[#8c6b23]">{tag}</span>;
  }
  if (tagType === "pro") {
    return <span className="text-xs font-bold text-[#a85c25]">{tag}</span>;
  }
  if (tagType === "success") {
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 tracking-wider">
        {tag}
      </span>
    );
  }
  return <span className="text-xs font-medium text-gray-400">{tag}</span>;
};

const renderActivityIcon = (type: ActivityItem["type"]) => {
  if (type === "user") {
    return (
      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
        <UserPlus size={18} />
      </div>
    );
  }
  if (type === "payment") {
    return (
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
        <CheckCircle2 size={18} />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
      <Settings size={18} />
    </div>
  );
};

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KpiData>({
    totalUsers: "24.892",
    usersTrend: "+12%",
    activeSubscriptions: "18.205",
    subscriptionsTrend: "+5.4%",
    mrr: "R$ 1.450.000",
    mrrTrend: "+8.2%",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      setIsLoading(true);
      const result = await getAdminKpisAction();

      if (result.success && result.data) {
        const raw = result.data as RawKpiResponse;
        setKpis({
          totalUsers: raw.totalUsers ? String(raw.totalUsers) : "24.892",
          usersTrend: raw.usersTrend || "+12%",
          activeSubscriptions: raw.activeSubscriptions
            ? String(raw.activeSubscriptions)
            : "18.205",
          subscriptionsTrend: raw.subscriptionsTrend || "+5.4%",
          mrr: raw.mrr ? `R$ ${raw.mrr}` : "R$ 1.450.000",
          mrrTrend: raw.mrrTrend || "+8.2%",
        });
      }
      setIsLoading(false);
    };

    fetchKpis();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Painel Executivo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bem-vindo de volta. Aqui está o desempenho da Priowl hoje.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Calendar size={14} className="text-gray-500" />
            <span>Últimos 30 dias</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 bg-[#735613] hover:bg-[#5e440d] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Download size={14} />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Grid de Cards KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Usuários */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#8c6b23]">
              <Users size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span>{kpis.usersTrend}</span>
              <TrendingUp size={12} />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
              TOTAL DE USUÁRIOS
            </span>
            <div className="text-3xl font-black text-gray-900 mt-1">
              {isLoading ? <Loader2 className="animate-spin text-gray-400" size={24} /> : kpis.totalUsers}
            </div>
          </div>
        </div>

        {/* Assinaturas Ativas */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#8c6b23]">
              <PlaySquare size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span>{kpis.subscriptionsTrend}</span>
              <TrendingUp size={12} />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
              ASSINATURAS ATIVAS
            </span>
            <div className="text-3xl font-black text-gray-900 mt-1">
              {isLoading ? <Loader2 className="animate-spin text-gray-400" size={24} /> : kpis.activeSubscriptions}
            </div>
          </div>
        </div>

        {/* Receita Mensal */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#8c6b23]">
              <CreditCard size={20} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span>{kpis.mrrTrend}</span>
              <TrendingUp size={12} />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
              RECEITA MENSAL (MRR)
            </span>
            <div className="text-3xl font-black text-gray-900 mt-1">
              {isLoading ? <Loader2 className="animate-spin text-gray-400" size={24} /> : kpis.mrr}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Crescimento de Usuários */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900">Crescimento de Usuários</h2>
            <span className="text-xs text-gray-400 font-medium">Últimos 30 dias</span>
          </div>

          <div className="relative w-full h-56 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8c6b23" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8c6b23" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                d="M 0 130 C 80 135 120 145 180 120 C 240 90 280 10 380 20 L 380 160 L 0 160 Z"
                fill="url(#userGrowthGrad)"
              />
              <path
                d="M 0 130 C 80 135 120 145 180 120 C 240 90 280 10 380 20"
                fill="none"
                stroke="#8c6b23"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400 font-medium pt-4 border-t border-gray-50">
            <span>Semana 1</span>
            <span>Semana 2</span>
            <span>Semana 3</span>
            <span>Semana 4</span>
          </div>
        </div>

        {/* Gráfico 2: Tendências de Receita */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-900">Tendências de Receita</h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#735613]" />
                <span className="text-gray-600">PLANO GOLD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9e4720]" />
                <span className="text-gray-600">PLANO PRO</span>
              </div>
            </div>
          </div>

          <div className="h-56 flex items-end justify-around px-4 pt-6 pb-2">
            {/* Jan */}
            <div className="flex gap-2 items-end h-full">
              <div className="w-4 bg-[#735613] rounded-t-sm h-[50%]" />
              <div className="w-4 bg-[#9e4720] rounded-t-sm h-[25%]" />
            </div>
            {/* Fev */}
            <div className="flex gap-2 items-end h-full">
              <div className="w-4 bg-[#735613] rounded-t-sm h-[65%]" />
              <div className="w-4 bg-[#9e4720] rounded-t-sm h-[35%]" />
            </div>
            {/* Mar */}
            <div className="flex gap-2 items-end h-full">
              <div className="w-4 bg-[#735613] rounded-t-sm h-[82%]" />
              <div className="w-4 bg-[#9e4720] rounded-t-sm h-[48%]" />
            </div>
            {/* Abr */}
            <div className="flex gap-2 items-end h-full">
              <div className="w-4 bg-[#735613] rounded-t-sm h-[88%]" />
              <div className="w-4 bg-[#9e4720] rounded-t-sm h-[58%]" />
            </div>
          </div>

          <div className="flex justify-around items-center text-xs text-gray-400 font-medium pt-4 border-t border-gray-50">
            <span>Jan</span>
            <span>Fev</span>
            <span>Mar</span>
            <span>Abr</span>
          </div>
        </div>
      </div>

      {/* Tabela de Atividades Recentes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-900">Atividade Recente</h2>
          <button type="button" className="text-xs font-semibold text-[#735613] hover:underline">
            Ver tudo
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {RECENT_ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="py-4 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-gray-50/50 transition-colors px-2 rounded-xl"
            >
              <div className="flex items-center gap-4">
                {renderActivityIcon(activity.type)}
                <div>
                  <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.subtitle}</p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                {renderActivityTag(activity.tag, activity.tagType)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}