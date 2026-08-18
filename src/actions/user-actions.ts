"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { SubscriptionResponse, PlanResponse } from "@/types/subscription";

// Centraliza a URL do backend com fallback seguro para dev
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function getMinhaAssinaturaAction(): Promise<SubscriptionResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("priowl_token")?.value;

    if (!token) return null;

    const res = await fetch(`${BACKEND_URL}/subscriptions/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["user-subscription"] },
    });

    if (!res.ok) {
      console.error(`Erro ao buscar assinatura: Status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Falha na requisição de assinatura:", error);
    return null;
  }
}

export async function getPlanosAction(): Promise<PlanResponse[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("priowl_token")?.value;

    const res = await fetch(`${BACKEND_URL}/plans`, { // SEM barra no final
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function atualizarPerfilAction(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  try {
    // Verifique se a rota do seu backend possui o prefixo /api. 
    // Ex: ${BACKEND_URL}/api/users/me (Se for o caso, altere aqui)
    const res = await fetch(`${BACKEND_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.message || "Falha ao atualizar dados." };
    }

    // @ts-expect-error - Bug de tipagem interno do Next.js
    revalidateTag("user-profile");
    
    // Retorno de sucesso para o formulário
    return { success: "Perfil atualizado com sucesso!" };
    
  } catch (error) {
    console.error("Erro na Server Action:", error);
    return { error: "Erro de conexão com o servidor." };
  }
}

export async function alterarSenhaAction(currentPassword: string, newPassword: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  if (!token) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  try {
    // Adicionado /api/users/me/password baseado no seu Controller Spring
    const res = await fetch(`${BACKEND_URL}/users/me/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        currentPassword: currentPassword.trim(), 
        newPassword: newPassword.trim() 
      }),
    });

    if (!res.ok) {
      const errorMsg = await res.text().catch(() => null);
      return { error: errorMsg || "A senha atual está incorreta ou ocorreu um erro." };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro na Server Action ao alterar senha:", error);
    return { error: "Erro de conexão com o servidor." };
  }
}

export async function excluirContaAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  try {
    const res = await fetch(`${BACKEND_URL}/users/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { error: "Falha ao excluir conta." };
    }

    cookieStore.delete("priowl_token");
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    return { error: "Não foi possível excluir a conta." };
  }

  // O redirect deve ser chamado fora do bloco try/catch no Next.js
  redirect("/auth?mode=login");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("priowl_token"); 
  redirect("/auth?mode=login");
}