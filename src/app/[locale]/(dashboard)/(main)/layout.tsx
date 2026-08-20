import React from "react";
import MainHeader from "@/components/layout/MainHeader";
import DeadlineToast from "@/components/layout/DeadlineToast";
import { getUserProfile } from "@/services/user";
import { getTasksAction } from "@/actions/task-actions";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, tasks] = await Promise.all([
    getUserProfile(),
    getTasksAction(), 
  ]);

  // 🔹 Fazemos um "de/para" garantindo que o campo 'dueDate' exista
  // para não quebrar a interface antiga do DeadlineToast
  const mappedTasks = (tasks || []).map(task => ({
    ...task,
    dueDate: task.deadline || "", // Clona o valor de deadline para dueDate
  }));

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background text-foreground">
      
      {/* Cabeçalho Superior */}
      <MainHeader user={user} />
      
      {/* Área Central de Conteúdo */}
      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 transition-colors duration-200">
        {children}
      </main>

      {/* 🔹 Toast Global de Prazos recebendo a lista mapeada */}
      {/* Ignoramos temporariamente tipagens restritas adicionais caso a interface Task seja muito diferente */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <DeadlineToast userTasks={mappedTasks as any} />
      
    </div>
  );
}