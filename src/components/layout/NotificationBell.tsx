"use client";

import { useState } from "react";
import { Bell, Clock } from "lucide-react";
import { analyzeTaskDeadlines } from "@/services/deadline";
import { Task } from "@/types/task";

interface NotificationBellProps {
  readonly userTasks?: readonly Task[];
}

export default function NotificationBell({ userTasks = [] }: Readonly<NotificationBellProps>) {
  const [isOpen, setIsOpen] = useState(false);

  // Deriva as tarefas urgentes/atrasadas diretamente no render
  const urgentTasks = analyzeTaskDeadlines(userTasks);
  const hasUnread = urgentTasks.length > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center rounded-full p-2 text-muted transition-colors hover:bg-card hover:text-foreground focus:outline-none"
        aria-label="Notificações"
      >
        <Bell size={22} strokeWidth={1.5} />

        {hasUnread && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white ring-2 ring-background">
            {urgentTasks.length}
          </span>
        )}
      </button>

      {/* Menu Flutuante de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <h4 className="text-sm font-bold">Notificações</h4>
            <span className="text-xs text-muted-foreground">{urgentTasks.length} pendentes</span>
          </div>

          {urgentTasks.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              Nenhum alerta de prazo pendente.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2.5 bg-background rounded-xl border-l-4 ${task.borderClass} flex items-center justify-between gap-2`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{task.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
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
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border shrink-0 ${task.badgeClass}`}
                  >
                    {task.timeLeftText}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}