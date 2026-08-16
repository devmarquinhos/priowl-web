import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import { Avatar } from "@/components/ui/Avatar";
import { UserProfileResponse } from "@/types/user";
import { CircleHelp } from "lucide-react";

interface SettingsHeaderProps {
  user: UserProfileResponse | null;
}

export default function SettingsHeader({ user }: SettingsHeaderProps) {
  const fallback = user?.username ? user.username.substring(0, 2).toUpperCase() : "US";

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-border bg-card px-8 transition-colors duration-200">
      
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Configurações
        </h1>
      </div>

      <div className="flex items-center gap-4">
        
        <div className="w-56">
          <SearchBar placeholder="Buscar configurações" />
        </div>

        <div className="flex items-center gap-1">
          <NotificationBell/>
          
          <button 
            type="button" 
            className="flex items-center justify-center rounded-full p-2 text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800 focus:outline-none"
            title="Ajuda e Suporte"
          >
            <CircleHelp size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mx-2 h-8 w-px bg-border"></div>

        <Avatar 
          alt={`Foto de perfil de ${user?.username || "Usuário"}`}
          fallbackInitials={fallback}
          size="md"
        />
      </div>

    </header>
  );
}