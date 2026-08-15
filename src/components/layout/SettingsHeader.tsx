import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import { Avatar } from "@/components/ui/Avatar";
import { UserProfileResponse } from "@/types/user";
import { CircleHelp } from "lucide-react"; // Ícone de ajuda da sua imagem

interface SettingsHeaderProps {
  user: UserProfileResponse | null;
}

export default function SettingsHeader({ user }: SettingsHeaderProps) {
  const fallback = user?.username ? user.username.substring(0, 2).toUpperCase() : "US";

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-gray-200 bg-white px-8">
      
      {/* Lado Esquerdo: Título da Página */}
      <div>
        <h1 className="text-3xl font-bold text-[#8A6D3B]">
          Configurações
        </h1>
      </div>

      {/* Lado Direito: Pesquisa, Ícones e Perfil */}
      <div className="flex items-center gap-4">
        
        {/* Barra de pesquisa menor */}
        <div className="w-56">
          <SearchBar placeholder="Buscar configurações" />
        </div>

        {/* Notificações e Ajuda */}
        <div className="flex items-center gap-1">
          <NotificationBell />
          
          <button 
            type="button" 
            className="flex items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            title="Ajuda e Suporte"
          >
            <CircleHelp size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Divisor Visual */}
        <div className="mx-2 h-8 w-px bg-gray-200"></div>

        {/* Avatar Isolado */}
        <Avatar 
          alt={`Foto de perfil de ${user?.username || "Usuário"}`}
          fallbackInitials={fallback}
          size="md"
        />
      </div>

    </header>
  );
}