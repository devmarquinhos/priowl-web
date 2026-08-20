"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  CreditCard, 
  Search, 
  Bell, 
  HelpCircle, 
  LifeBuoy, 
  Settings 
} from "lucide-react";

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/pt/admin/dashboard", icon: LayoutDashboard },
    { name: "User Management", href: "/pt/admin/users", icon: Users },
    { name: "Plan Management", href: "/pt/admin/plans", icon: ClipboardList },
    { name: "Billing", href: "/pt/admin/billing", icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-gray-900 font-sans">
      
      {/* 🔹 SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#8c6b23]">Priowl</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Admin Suite</p>
          </div>

          {/* Navegação */}
          <nav className="mt-4 flex flex-col gap-1 px-4">
            {navItems.map((item) => {
              const isActive = pathname.includes(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-[#fcfaf5] text-[#8c6b23] border-l-4 border-[#8c6b23]" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer da Sidebar */}
        <div className="p-4">
          <div className="bg-[#f5f3e9] p-4 rounded-lg mb-4">
            <h4 className="text-xs font-bold text-[#8c6b23] mb-1">Suporte Premium</h4>
            <p className="text-xs text-gray-600 mb-3">Acesse o seu gerente de contas dedicado.</p>
            <button className="w-full bg-[#b8860b] hover:bg-[#997300] text-white text-xs font-bold py-2 rounded transition-colors">
              VIP Gold Support
            </button>
          </div>
          
          <nav className="flex flex-col gap-2">
            <Link href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              <LifeBuoy size={18} /> Support
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* 🔹 CONTEÚDO PRINCIPAL (Header + Page) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          {/* Busca */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar métricas..." 
              className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c6b23]/20"
            />
          </div>

          {/* Perfil e Notificações */}
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-gray-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <HelpCircle size={20} />
            </button>
            
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200 cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Priowl Gold</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* ÁREA DA PÁGINA (Telas vão renderizar aqui dentro) */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>

    </div>
  );
}