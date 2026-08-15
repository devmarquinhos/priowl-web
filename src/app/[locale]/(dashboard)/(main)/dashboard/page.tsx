import { cookies } from "next/headers";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      // Em vez de explodir a tela (throw new Error), avisamos no console do servidor 
      // e retornamos dados falsos para você conseguir visualizar e testar a UI.
      console.warn("⚠️ API do Dashboard falhou ou não existe. Retornando Mock.");
      return {
        isMock: true,
        pendingTasks: 18,
        userName: "Usuário Teste", // Você pode usar isso para testar o fluxo
      };
    }

    return await res.json();
  } catch (error) {
    console.error("Erro de conexão com o backend:", error);
    // Retorna fallback caso o fetch falhe (ex: backend desligado)
    return { isMock: true, pendingTasks: 0 };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel de Controle</h1>
        <p className="text-gray-500">
          Bem-vindo de volta. Você tem {data?.pendingTasks || 0} tarefas pendentes.
        </p>
        
        {/* Aviso temporário para você lembrar que está mockado */}
        {data?.isMock && (
          <span className="mt-2 inline-block rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
            Modo de Teste Visual (Sem Backend)
          </span>
        )}
      </div>

      {/* Grid de Cards (Vazio por enquanto, só para segurar a estrutura) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="h-32 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          Card 1
        </div>
        <div className="h-32 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          Card 2
        </div>
      </div>
    </div>
  );
}