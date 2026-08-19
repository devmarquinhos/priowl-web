"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api";

// 1. TIPAGENS EXPORTADAS PARA USO NO FRONTEND
export interface PlanData {
  id: number;
  name: string;
  price: number;
  description: string;
  maxTasks: number;
}

export interface UserSubscription {
  id: number | null;
  planName: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  maxTasks: number;
}

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("priowl_token")?.value;
}

/* ==========================================================================
   1. QUERIES (BUSCA DE DADOS)
   ========================================================================== */

/**
 * Busca a assinatura atual do usuário logado
 * GET /api/subscriptions/me
 */
export async function getMinhaAssinaturaAction(): Promise<UserSubscription | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["user-subscription"] }, 
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    return null;
  }
}

/**
 * Busca todos os planos ativos cadastrados no sistema
 * GET /api/plans
 */
export async function getPlanosAction(): Promise<PlanData[]> {
  // Alterado: não exigimos token para ver os planos na Landing Page
  const token = await getToken(); 
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/plans`, {
      method: "GET",
      headers,
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    return [];
  }
}

/**
 * Busca o histórico de pagamentos/faturas do usuário logado
 * GET /api/payments/me
 */
export async function getMeusPagamentosAction() {
  const token = await getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${BACKEND_URL}/payments/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["user-payments"] },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar histórico de pagamentos:", error);
    return [];
  }
}

/* ==========================================================================
   2. MUTATIONS (AÇÕES DO USUÁRIO)
   ========================================================================== */

export async function checkoutPlanoAction(planId: number) {
  const token = await getToken();
  if (!token) return { error: "Não autorizado" };

  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.error || "Falha ao iniciar checkout." };
    }

    const data = await res.json();
    return { success: true, checkoutUrl: data.checkoutUrl };
  } catch (error) {
    console.error("Erro ao iniciar checkout:", error); 
    return { error: "Erro de conexão com o servidor." };
  }
}

export async function alterarPlanoAction(planId: number) {
  const token = await getToken();
  if (!token) return { error: "Não autorizado" };

  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/me/plan`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 🔹 CORREÇÃO: O token precisa ser enviado aqui!
      },
      body: JSON.stringify({
        planId: planId,
        status: "ACTIVE" 
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.error || "Falha ao alterar plano." };
    }
    
    // @ts-expect-error - Bug de tipagem interno do Next.js
    revalidateTag("user-subscription"); 
    return { success: true };
  } catch (error) {
    console.error("Erro ao alterar plano:", error); 
    return { error: "Erro de conexão com o servidor." };
  }
}

export async function cancelarAssinaturaAction() {
  const token = await getToken();
  if (!token) return { error: "Não autorizado" };

  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/me/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.error || "Falha ao cancelar assinatura." };
    }
    
    // @ts-expect-error - Bug de tipagem interno do Next.js
    revalidateTag("user-subscription");
    return { success: true };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error); 
    return { error: "Erro de conexão com o servidor." };
  }
}