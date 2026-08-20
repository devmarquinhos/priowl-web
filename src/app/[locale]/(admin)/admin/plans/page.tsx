"use client";

import { useState, useEffect } from "react";
import { Check, Plus, Edit2, Loader2 } from "lucide-react";
import { getAdminPlansAction } from "@/actions/admin-actions";

interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  badge: string;
  name: string;
  price: string;
  period: string;
  description: string;
  taskLimit: string;
  features: PlanFeature[];
  updatedAt: string;
  isPopular?: boolean;
}

interface RawPlan {
  id: number | string;
  badge?: string;
  name?: string;
  nome?: string;
  price?: number | string;
  preco?: number | string;
  period?: string;
  description?: string;
  descricao?: string;
  taskLimit?: number | string;
  limiteTarefas?: number | string;
  features?: string[] | { text: string }[] | string;
  updatedAt?: string;
  updated_at?: string;
  isPopular?: boolean;
  is_popular?: boolean;
  popular?: boolean;
}

interface Metric {
  label: string;
  value: string;
  highlight?: boolean;
}

// Funções utilitárias movidas para fora do componente
const renderCardBorder = (isPopular?: boolean) => {
  if (isPopular) {
    return "border-2 border-[#735613] relative shadow-md";
  }
  return "border border-gray-200";
};

const renderTaskLimitClass = () => "text-[#735613] font-bold";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      const result = await getAdminPlansAction();

      if (result.error) {
        setErrorMsg(result.error);
      } else if (result.success && Array.isArray(result.data)) {
        const mappedPlans: Plan[] = (result.data as RawPlan[]).map((p) => {
          let featureList: PlanFeature[] = [];

          if (Array.isArray(p.features)) {
            featureList = p.features.map((f) =>
              typeof f === "string" ? { text: f } : { text: f.text || "" }
            );
          } else if (typeof p.features === "string") {
            featureList = p.features.split(",").map((item) => ({ text: item.trim() }));
          }

          const rawPrice = p.price ?? p.preco;
          const formattedPrice =
            typeof rawPrice === "number" ? `R$ ${rawPrice}` : String(rawPrice || "R$ 0");

          const rawDate = p.updatedAt ?? p.updated_at;
          const formattedDate = rawDate
            ? `Atualizado em ${new Date(rawDate).toLocaleDateString("pt-BR")}`
            : "Atualizado recentemente";

          return {
            id: String(p.id),
            badge: p.badge || "PLANO",
            name: p.name ?? p.nome ?? "Sem nome",
            price: formattedPrice,
            period: p.period || "/mês",
            description: p.description ?? p.descricao ?? "",
            taskLimit: String(p.taskLimit ?? p.limiteTarefas ?? "Ilimitado"),
            features: featureList,
            updatedAt: formattedDate,
            isPopular: Boolean(p.isPopular ?? p.is_popular ?? p.popular),
          };
        });

        setPlans(mappedPlans);
      }
      setIsLoading(false);
    };

    fetchPlans();
  }, []);

  const metricsData: Metric[] = [
    { label: "PLANOS ATIVOS", value: String(plans.length) },
    { label: "TOTAL DE ASSINANTES", value: "1,248" },
    { label: "TICKET MÉDIO", value: "R$ 132,40" },
    { label: "NOVAS ASSINATURAS (MÊS)", value: "+12%", highlight: true },
  ];

  const renderPlansGrid = () => {
    if (isLoading) {
      return (
        <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#8c6b23]">
          <Loader2 className="animate-spin mb-2" size={32} />
          <span className="text-sm font-medium">Carregando planos do banco de dados...</span>
        </div>
      );
    }

    if (errorMsg) {
      return (
        <div className="col-span-full py-12 text-center text-red-500 font-medium bg-red-50/50 rounded-2xl border border-red-100">
          {errorMsg}
        </div>
      );
    }

    if (plans.length === 0) {
      return (
        <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          Nenhum plano cadastrado no banco de dados.
        </div>
      );
    }

    return plans.map((plan) => (
      <div
        key={plan.id}
        className={`bg-white rounded-2xl p-6 flex flex-col justify-between transition-all ${renderCardBorder(
          plan.isPopular
        )}`}
      >
        {plan.isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6b4e0e] text-white text-[11px] font-bold tracking-wider px-6 py-1.5 rounded-xl uppercase shadow-sm">
            Mais Popular
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4 mt-1">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
              {plan.badge}
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-[#8c6b23] p-1 rounded transition-colors"
              title="Editar Plano"
            >
              <Edit2 size={16} />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
            <span className="text-sm text-gray-500 font-medium">{plan.period}</span>
          </div>
          <p className="text-xs text-gray-500 min-h-[32px] leading-relaxed">
            {plan.description}
          </p>

          <hr className="my-5 border-gray-100" />

          <div className="flex justify-between items-center text-xs mb-5">
            <span className="text-gray-600 font-medium">Limite de Tarefas</span>
            <span className={renderTaskLimitClass()}>{plan.taskLimit}</span>
          </div>

          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-[#735613] flex items-center justify-center shrink-0">
                  <Check size={10} className="text-white stroke-[3]" />
                </div>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-50 text-center">
          <span className="text-[11px] text-gray-400 font-medium">{plan.updatedAt}</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Modelos de Assinatura
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as ofertas, limites de tarefas e valores dos planos disponíveis para os clientes.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 bg-[#8c6b23] hover:bg-[#735613] text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Criar Novo Plano</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        {renderPlansGrid()}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {metricsData.map((metric, idx) => (
          <div
            key={idx}
            className="bg-gray-100/70 rounded-xl p-5 flex flex-col justify-between border border-gray-100"
          >
            <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">
              {metric.label}
            </span>
            <span
              className={`text-2xl font-black ${
                metric.highlight ? "text-[#735613]" : "text-gray-900"
              }`}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}