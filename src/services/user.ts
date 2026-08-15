import { cookies } from "next/headers";
import { UserProfileResponse } from "@/types/user"; // Importando o tipo centralizado!

export async function getUserProfile(): Promise<UserProfileResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["user-profile"] },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}