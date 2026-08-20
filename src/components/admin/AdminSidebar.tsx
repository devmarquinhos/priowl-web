"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  CreditCard, 
  ArrowLeft 
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/pt/admin/dashboard", icon: LayoutDashboard },
    { name: "User Management", href: "/pt/admin/users", icon: Users },
    { name: "Plan Management", href: "/pt/admin/plans", icon: ClipboardList },
    { name: "Billing", href: "/pt/admin/billing", icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 h-full">
      <div>
        {/* Logo Priowl */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#8c6b23]">Priowl</h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">Admin Suite</p>
        </div>

        {/* Abas de Navegação */}
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

      {/* Rodapé: Botão de Retorno */}
      <div className="p-4 border-t border-gray-100">
        <Link 
          href="/dashboard" /* 🔹 Se usar o locale na URL base do usuário, ajuste para "/pt/dashboard" */
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors border border-gray-200"
        >
          <ArrowLeft size={16} />
          Voltar para o App
        </Link>
      </div>
    </aside>
  );
}