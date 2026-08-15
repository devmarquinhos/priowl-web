import { Bell } from "lucide-react";

interface NotificationBellProps {
  // Define se a bolinha vermelha de notificação não lida vai aparecer
  readonly hasUnread?: boolean; 
}

export default function NotificationBell({ hasUnread = true }: NotificationBellProps) {
  return (
    <button 
      type="button" 
      className="relative flex items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
      aria-label="Notificações"
    >
      <Bell size={22} strokeWidth={1.5} />
      
      {/* Indicador de notificação (Ponto Vermelho) */}
      {hasUnread && (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
}