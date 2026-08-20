import React from "react";
import MainHeader from "@/components/layout/MainHeader";
import DeadlineToast from "@/components/layout/DeadlineToast";
import { getUserProfile } from "@/services/user";
import { getTasksAction } from "@/actions/task-actions"; // 🔹 Nome da função atualizado!

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 🔹 Busca o perfil e as tarefas. 
  // Como o seu getTasksAction agora retorna direto o array, fica muito mais limpo!
  const [user, tasks] = await Promise.all([
    getUserProfile(),
    getTasksAction(), 
  ]);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background text-foreground">
      
      {/* Cabeçalho Superior */}
      <MainHeader user={user} />
      
      {/* Área Central de Conteúdo */}
      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 transition-colors duration-200">
        {children}
      </main>

      {/* 🔹 Toast Global de Prazos */}
      {/* Passamos 'tasks || []' como precaução de fallback */}
      <DeadlineToast userTasks={tasks || []} />
      
    </div>
  );
}