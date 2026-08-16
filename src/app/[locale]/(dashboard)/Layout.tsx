import Sidebar from "@/components/layout/Sidebar";
import { getUserProfile } from "@/services/user";

export default async function BaseLayout({ children }: { children: React.ReactNode }) {
  // Busca o usuário do cache/backend
  const user = await getUserProfile();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-200">
      <Sidebar user={user} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {children} 
      </div>
    </div>
  );
}