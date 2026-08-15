"use server"; // <-- Isso diz ao Next.js que essas funções rodam EXCLUSIVAMENTE no servidor

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function atualizarPerfilAction(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }), // Monta o JSON que o Java espera (UpdateProfileRequest)
    });

    if (!res.ok) {
      throw new Error("Falha ao atualizar dados");
    }

    // A MÁGICA ACONTECE AQUI! 
    // Dizemos para o Next.js: "Lembra daquele cache com a tag 'user-profile'? Joga fora e busca de novo!"
    revalidateTag("user-profile");
    
  } catch (error) {
    console.error("Erro na Server Action:", error);
    // Aqui você poderia retornar um objeto com erro para exibir na tela
  }
}