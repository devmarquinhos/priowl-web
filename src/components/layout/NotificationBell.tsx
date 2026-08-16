import { Bell } from "lucide-react";

interface NotificationBellProps {
  readonly hasUnread?: boolean; 
}

export default function NotificationBell({ hasUnread = true }: NotificationBellProps) {
  return (
    <button 
      type="button" 
      className="relative flex items-center justify-center rounded-full p-2 text-muted transition-colors hover:bg-card hover:text-foreground focus:outline-none"
      aria-label="Notificações"
    >
      <Bell size={22} strokeWidth={1.5} />
      
      {hasUnread && (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-error ring-2 ring-background" />
      )}
    </button>
  );
}