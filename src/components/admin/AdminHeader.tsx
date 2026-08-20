"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { UserProfileResponse } from "@/types/user";

interface AdminHeaderProps {
  user: UserProfileResponse | null;
}

export default function AdminHeader({ user }: Readonly<AdminHeaderProps>) {
  // Pega as duas primeiras letras do nome, ou usa "AD" como padrão
  const fallback = user?.username ? user.username.substring(0, 2).toUpperCase() : "AD";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
      
      {/* Busca */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar métricas..." 
          className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c6b23]/20 transition-all"
        />
      </div>

      {/* Perfil e Notificações */}
      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-gray-700 relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <HelpCircle size={20} />
        </button>
        
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {user?.username || "Administrador"}
            </p>
            <p className="text-xs text-[#8c6b23] font-medium">
              {String(user?.isAdmin) === "true" ? "Administrador" : "Gestor"}
            </p>
          </div>
          
          {/* Reutilizando seu componente Avatar */}
          <Avatar 
            alt={`Foto de perfil de ${user?.username || "Admin"}`}
            fallbackInitials={fallback}
            size="md"
          />
        </div>
      </div>
      
    </header>
  );
}