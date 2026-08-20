import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import { Avatar } from "@/components/ui/Avatar"; 
import { UserProfileResponse } from "@/types/user";
import Link from "next/link"; // 🔹 Importação do Link do Next.js
import { Task } from "@/types/task";

interface MainHeaderProps {
  user: UserProfileResponse | null;
  readonly tasks?: readonly Task[];
}

export default function MainHeader({ user, tasks }: Readonly<MainHeaderProps>) {
  const fallback = user?.username ? user.username.substring(0, 2).toUpperCase() : "US";
  
  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-border bg-card px-8 transition-colors">
      
      <div className="w-1/3 min-w-[320px] max-w-md">
        <SearchBar placeholder="Pesquisar tarefas..." />
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell userTasks={tasks}/>
        
        <div className="h-8 w-px bg-border"></div>

        <div className="flex items-center gap-3 transition-opacity hover:opacity-80">
          
          {/* 🔹 Substituímos a div por um Link apontando para a mesma rota do Avatar */}
          <Link href="/settings" className="flex cursor-pointer flex-col text-right">
            <span className="text-sm font-bold text-foreground">
              {user?.username || "Usuário"}
            </span>
            {user?.isAdmin === true && (
              <span className="text-xs font-medium text-muted">
                Administrador
              </span>
            )}
          </Link>
          
          <Avatar 
            alt={`Foto de perfil de ${user?.username || "Usuário"}`}
            fallbackInitials={fallback}
            size="md"
            href="/settings"
          />
        </div>

      </div>
    </header>
  );
}