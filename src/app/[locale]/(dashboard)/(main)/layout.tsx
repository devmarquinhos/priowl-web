import React from "react";
import MainHeader from "@/components/layout/MainHeader";
import DeadlineToast from "@/components/layout/DeadlineToast";
import { getUserProfile } from "@/services/user";
import { getTasksAction } from "@/actions/task-actions";
import { Task } from "@/types/task";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, tasks] = await Promise.all([
    getUserProfile(),
    getTasksAction(), 
  ]);

  // 🔹 Convertemos o 'id' para string e criamos o 'dueDate'
  const mappedTasks = (tasks || []).map(task => ({
    ...task,
    id: String(task.id), // Converte id de number para string
    dueDate: task.deadline || "", // Clona o valor de deadline para dueDate
  })) as unknown as Task[];

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background text-foreground">
      
      {/* Cabeçalho Superior */}
      <MainHeader user={user} tasks={mappedTasks} />
      
      {/* Área Central de Conteúdo */}
      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 transition-colors duration-200">
        {children}
      </main>

      {/* Toast Global de Prazos */}
      <DeadlineToast userTasks={mappedTasks} />
      
    </div>
  );
}