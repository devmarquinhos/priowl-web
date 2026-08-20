"use server";

// Centraliza a URL do backend com fallback seguro para dev
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

/**
 * Chama o endpoint POST /api/auth/password/forgot
 */
export async function solicitarRecuperacaoSenhaAction(email: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/password/forgot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      // Mesmo que o backend silencie, tratamos caso caia em algum erro de servidor (500)
      return { error: "Ocorreu um erro ao processar sua solicitação." };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao solicitar recuperação:", error);
    return { error: "Erro de conexão com o servidor." };
  }
}

/**
 * Chama o endpoint POST /api/auth/password/reset
 */
export async function redefinirSenhaEsquecidaAction(token: string, newPassword: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/password/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!res.ok) {
      const errorMsg = await res.text().catch(() => null);
      return { error: errorMsg || "O link é inválido ou expirou." };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao redefinir senha esquecida:", error);
    return { error: "Erro de conexão com o servidor." };
  }
}