"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TaskModal } from "@/components/modals/TaskModal";
import type { CategoryResponse } from "@/actions/category-actions"; 
import type { TaskResponse } from "@/actions/task-actions";

interface NewTaskButtonProps {
  readonly categories: CategoryResponse[];
  readonly tasks: TaskResponse[];
}

export function NewTaskButton({ categories, tasks }: NewTaskButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold shadow-sm"
      >
        <Plus size={16} /> Nova Tarefa
      </Button>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        key="nova-tarefa" 
        categories={categories}
        allTasks={tasks}
      />
    </>
  );
}