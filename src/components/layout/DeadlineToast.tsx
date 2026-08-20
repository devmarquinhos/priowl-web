"use client";

import { useState } from "react";
import { Clock, X, Bell } from "lucide-react";
import { analyzeTaskDeadlines } from "@/services/deadline";
import { Task } from "@/types/task";

interface DeadlineToastProps {
  readonly userTasks: readonly Task[];
}

export default function DeadlineToast({ userTasks }: Readonly<DeadlineToastProps>) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Derivação de estado diretamente no render (elimina o useEffect e evita re-renders em cascata)
  const urgentTasks = analyzeTaskDeadlines([...userTasks]);

  if (isDismissed || urgentTasks.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#735613] px-4 py-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} />
          <span className="font-bold text-sm">Alertas de Prazo</span>
        </div>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-white/80 hover:text-white p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        {urgentTasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 bg-gray-50 rounded-xl border-l-4 ${task.borderClass} flex items-center justify-between gap-3`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 truncate">{task.title}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500">
                <Clock size={12} />
                <span>
                  {new Date(task.dueDate).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border shrink-0 ${task.badgeClass}`}
            >
              {task.timeLeftText}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}