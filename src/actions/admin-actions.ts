"use server";

import { cookies } from "next/headers";

const API_URL = process.env.BACKEND_URL || "http://localhost:8080";

async function getAuthHeaders() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("priowl_token")?.value;

  if (!token) {
    throw new Error("Acesso negado. Token não encontrado.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminUsersAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/users`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Falha ao buscar usuários.`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erro de conexão com o servidor." };
  }
}

export async function getAdminUserByIdAction(id: number) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Usuário não encontrado.`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erro de conexão com o servidor." };
  }
}

export async function getAdminSubscriptionsAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/subscriptions`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Falha ao buscar assinaturas.`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erro de conexão com o servidor." };
  }
}

export async function getAdminSubscriptionByIdAction(id: number) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/subscriptions/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Assinatura não encontrada.`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erro de conexão com o servidor." };
  }
}

export async function getAdminPaymentsAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/payments`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Falha ao buscar pagamentos.`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erro de conexão com o servidor." };
  }
}

export async function getAdminKpisAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/dashboard/kpis`, {
      method: "GET",
      headers,
      cache: "no-store", 
    });

    if (!response.ok) throw new Error(`Erro ${response.status}: Falha ao buscar métricas (KPIs).`);
    
    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erro de conexão com o servidor." };
  }
}

export async function getAdminPlansAction() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/plans`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Falha ao carregar modelos de assinatura.`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Erro de conexão com o servidor." };
  }
}