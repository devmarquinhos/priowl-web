"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const API_URL = process.env.BACKEND_URL || "http://localhost:8080/api";
const TOKEN_COOKIE_NAME = "priowl_token";

export interface CategoryResponse {
  id: number;
  title: string;
  color?: string; 
  taskCount?: number; 
}

/**
 * 🔹 Buscar todas as categorias do usuário logado
 * GET /api/categories
 */
export async function getMinhasCategoriasAction(): Promise<CategoryResponse[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    console.error("Nenhum token encontrado. Usuário não autenticado.");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["user-categories"] }
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

/**
 * 🔹 Criar uma nova categoria
 * POST /api/categories
 */
export async function createCategoriaAction(title: string, color: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, color }),
    });
    if (!response.ok) {
      const errorMsg = await response.text().catch(() => null);
      return { success: false, error: errorMsg || "Falha ao criar categoria" };
    }
    const data = await response.json();
    // @ts-expect-error - Bug de tipagem interno do Next.js
    revalidateTag("user-categories"); 
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return { success: false, error: "Não foi possível criar a categoria." };
  }
}

/**
 * 🔹 Editar uma categoria existente
 * PUT /api/categories/{id}
 */
export async function updateCategoriaAction(id: number, title: string, color: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, color }),
    });

    if (!response.ok) {
      const errorMsg = await response.text().catch(() => null);
      return { success: false, error: errorMsg || "Falha ao atualizar categoria" };
    }

    const data = await response.json();
    
    // @ts-expect-error - Bug de tipagem interno do Next.js
    revalidateTag("user-categories");
    
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { success: false, error: "Não foi possível atualizar a categoria." };
  }
}

/**
 * 🔹 Deletar uma categoria
 * DELETE /api/categories/{id}
 */
export async function deleteCategoriaAction(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMsg = await response.text().catch(() => null);
      return { success: false, error: errorMsg || "Falha ao deletar categoria" };
    }
    // @ts-expect-error - Bug de tipagem interno do Next.js
    revalidateTag("user-categories");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return { success: false, error: "Não foi possível deletar a categoria." };
  }
}