"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const API_URL = process.env.BACKEND_URL || "http://localhost:8080/api";
const TOKEN_COOKIE_NAME = "priowl_token";

/* ==========================================================================
   1. INTERFACES (SINCRONIZADAS COM O JAVA)
   ========================================================================== */

export interface SubTaskResponse {
  id: number;
  title: string;
  status: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | (string & {});
  importance: number;
  deadline?: string;
  categoryId?: number;
  parentTaskId?: number;
  branchProgress: number;
  subtasks?: SubTaskResponse[];
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | (string & {});
  importance: number;
  deadline?: string;
  categoryId?: number;
  parentTaskId?: number;
}

export interface DashboardResponse {
  overallProgress: number;
  completedTasks: number;
  totalActiveTasks: number;
  cancelledTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
}

/* ==========================================================================
   HELPER DE AUTENTICAÇÃO E ERROS
   ========================================================================== */

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

async function extractErrorMessage(response: Response, defaultMessage: string): Promise<string> {
  try {
    const data = await response.json();
    return data.error || defaultMessage;
  } catch {
    const text = await response.text().catch(() => null);
    return text || defaultMessage;
  }
}

/* ==========================================================================
   2. QUERIES (BUSCAS E LISTAGENS)
   ========================================================================== */

export async function getTasksAction(): Promise<TaskResponse[]> {
  const token = await getToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["user-tasks"] }
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return [];
  }
}

export async function getTaskByIdAction(id: number): Promise<TaskResponse | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    return null;
  }
}

export async function getDashboardSummaryAction(): Promise<DashboardResponse | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/tasks/summary`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["user-tasks", "task-summary"] }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar resumo do dashboard:", error);
    return null;
  }
}

export async function filterTasksAction(queryString: string): Promise<TaskResponse[]> {
  const token = await getToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_URL}/tasks/filter?${queryString}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store" 
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erro ao filtrar tarefas:", error);
    return [];
  }
}

/* ==========================================================================
   3. MUTAÇÕES (CRIAR, EDITAR, DELETAR)
   ========================================================================== */

export async function createTaskAction(data: TaskInput) {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response, "Falha ao criar tarefa");
      return { success: false, error: errorMsg };
    }
    // @ts-expect-error - Next.js internal revalidateTag typings bug
    revalidateTag("user-tasks"); 
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return { success: false, error: "Erro de conexão." };
  }
}

export async function updateTaskAction(id: number, data: Partial<TaskInput>) {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const currentTaskRes = await fetch(`${API_URL}/tasks/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!currentTaskRes.ok) {
      return { success: false, error: "Falha ao buscar tarefa original para atualização" };
    }
    
    const currentTask = await currentTaskRes.json();

    const payloadCompleto = {
      title: currentTask.title,
      description: currentTask.description,
      status: currentTask.status,
      importance: currentTask.importance,
      deadline: currentTask.deadline,
      categoryId: currentTask.categoryId,
      parentTaskId: currentTask.parentTaskId,
      ...data
    };

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payloadCompleto),
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response, "Falha ao atualizar tarefa");
      return { success: false, error: errorMsg };
    }

    // @ts-expect-error - Next.js internal revalidateTag typings bug
    revalidateTag("user-tasks");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    return { success: false, error: "Erro de conexão." };
  }
}

export async function deleteTaskAction(id: number) {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response, "Falha ao deletar tarefa");
      return { success: false, error: errorMsg };
    }

    // @ts-expect-error - Next.js internal revalidateTag typings bug
    revalidateTag("user-tasks");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    return { success: false, error: "Erro de conexão." };
  }
}

/* ==========================================================================
   4. DEPENDÊNCIAS DE TAREFAS (BLOQUEIOS)
   ========================================================================== */

export async function getTaskDependenciesAction(taskId: number): Promise<TaskResponse[]> {
  const token = await getToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/dependencies`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dependências da tarefa:", error);
    return [];
  }
}

export async function addDependencyAction(taskId: number, blockingId: number) {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/dependencies/${blockingId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response, "Falha ao adicionar dependência");
      return { success: false, error: errorMsg };
    }

    // @ts-expect-error - Next.js internal revalidateTag typings bug
    revalidateTag("user-tasks");
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar dependência:", error);
    return { success: false, error: "Erro de conexão." };
  }
}

export async function removeDependencyAction(taskId: number, blockingId: number) {
  const token = await getToken();
  if (!token) return { success: false, error: "Não autorizado" };

  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/dependencies/${blockingId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorMsg = await extractErrorMessage(response, "Falha ao remover dependência");
      return { success: false, error: errorMsg };
    }

    // @ts-expect-error - Next.js internal revalidateTag typings bug
    revalidateTag("user-tasks");
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover dependência:", error);
    return { success: false, error: "Erro de conexão." };
  }
}