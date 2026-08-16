"use server";

import { cookies } from "next/headers";
import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function atualizarPerfilAction(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  // No Next.js mais recente, cookies() precisa de 'await'
  const cookieStore = await cookies();
  const token = cookieStore.get("priowl_token")?.value;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }),
    });

    if (!res.ok) {
      throw new Error("Falha ao atualizar dados");
    }

    // @ts-expect-error - Bug de tipagem interno do Next.js na versão atual
    revalidateTag("user-profile");
    
  } catch (error) {
    console.error("Erro na Server Action:", error);
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  
  cookieStore.delete("priowl_token"); 
  
  redirect("/auth?mode=login");
}