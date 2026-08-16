import { cookies } from "next/headers";
import { Button } from "@/components/ui/Button"; // Ajuste o import se necessário
import { Download, Calendar } from "lucide-react";

async function getRelatoriosData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  try {
    // Tenta buscar da API (ajuste a rota do endpoint quando o backend estiver pronto)
    const res = await fetch(`${process.env.BACKEND_URL}/reports/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("⚠️ API de Relatórios falhou ou não existe. Retornando Mock.");
      return {
        isMock: true,
        concluidas: 45,
        criadas: 52,
      };
    }

    return await res.json();
  } catch (error) {
    console.error("Erro de conexão com o backend em relatórios:", error);
    return { isMock: true, concluidas: 0, criadas: 0 };
  }
}

export default async function RelatoriosPage() {
  const data = await getRelatoriosData();

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página de Relatórios */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Workspace</span>
            <span>{">"}</span>
            <span className="font-medium text-gray-900">Relatórios e Progresso</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Relatórios e Progresso
          </h1>
          {data?.isMock && (
            <span className="mt-2 inline-block rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
              Modo de Teste Visual (Sem Backend)
            </span>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white text-gray-700">
            <Download size={16} />
            Exportar PDF
          </Button>
          <Button className="flex items-center gap-2 bg-[#8A6D3B] text-white hover:bg-[#725a30]">
            <Calendar size={16} />
            Últimos 30 dias
          </Button>
        </div>
      </div>

      {/* Grid de Conteúdo Falso (Esqueleto para os gráficos que virão) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[300px] flex items-center justify-center text-gray-400">
          Área do Gráfico "Visão Geral de Tarefas"
        </div>

        {/* Cards Laterais */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[140px] flex items-center justify-center text-gray-400">
            Expansão de Mercado
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[140px] flex items-center justify-center text-gray-400">
            Redesign da Marca
          </div>
        </div>
      </div>
      
      {/* Mapa de Dependências */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[250px] flex items-center justify-center text-gray-400">
        Área do "Mapa de Dependências"
      </div>
    </div>
  );
}