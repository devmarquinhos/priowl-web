import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import { Avatar } from "@/components/ui/Avatar"; 
import { UserProfileResponse } from "@/types/user";

interface MainHeaderProps {
  user: UserProfileResponse | null; 
}

export default function MainHeader({ user }: MainHeaderProps) {
  const fallback = user?.username ? user.username.substring(0, 2).toUpperCase() : "US";
  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-gray-200 bg-white px-8">
      
      <div className="w-1/3 min-w-[320px] max-w-md">
        <SearchBar placeholder="Pesquisar tarefas..." />
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell />
        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-gray-900">
              {user?.username || "Usuário"}
            </span>
            {user?.isAdmin === true && (
              <span className="text-xs font-medium text-gray-500">
                Administrador
              </span>
            )}
          </div>
          
          {/* Avatar dinâmico */}
          <Avatar 
            alt={`Foto de perfil de ${user?.username || "Usuário"}`}
            fallbackInitials={fallback}
            size="md"
            href="/configuracoes"
          />
        </div>

      </div>
    </header>
  );
}