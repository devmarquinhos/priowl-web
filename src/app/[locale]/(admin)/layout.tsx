import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getUserProfile } from "@/actions/user-actions"; 

export default async function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  // Busca o usuário logado no servidor para passar para o Header
  const user = await getUserProfile();

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-gray-900 font-sans">
      
      {/* SIDEBAR DO ADMIN */}
      <AdminSidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER DO ADMIN */}
        <AdminHeader user={user} />

        {/* ÁREA DA PÁGINA (Dashboard, Usuários, etc) */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
        
      </main>

    </div>
  );
}