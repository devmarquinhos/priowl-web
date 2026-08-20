"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Search, Loader2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAdminUsersAction } from "@/actions/admin-actions"; 

interface AdminUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  status: "success" | "error" | "warning" | "neutral";
  createdAt: string;
}

interface RawUser {
  id: number;
  username: string;
  email: string;
  is_admin?: boolean;
  isAdmin?: boolean;
  status?: string;
  created_in?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      
      const result = await getAdminUsersAction();
      
      if (result.error) {
        setErrorMsg(result.error);
      } else if (result.success && result.data) {
        const mappedUsers: AdminUser[] = (result.data as RawUser[]).map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          isAdmin: Boolean(u.is_admin ?? u.isAdmin), 
          status: (u.status as AdminUser["status"]) || "success",
          createdAt: u.created_in ?? u.createdAt ?? ""
        }));
        setUsers(mappedUsers);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    if (status === "success") return "Ativo";
    if (status === "error") return "Suspenso";
    return "Pendente";
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center text-[#8c6b23]">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-sm">Carregando usuários...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (errorMsg) {
      return (
        <tr>
          <td colSpan={4} className="px-6 py-12 text-center text-red-500 font-medium bg-red-50/50">
            {errorMsg}
          </td>
        </tr>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
            Nenhum usuário encontrado.
          </td>
        </tr>
      );
    }

    return filteredUsers.map((user) => (
      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">{user.username}</div>
          <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
        </td>
        <td className="px-6 py-4">
          {user.isAdmin ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c6b23] bg-[#fcfaf5] px-2.5 py-1 rounded-full border border-[#8c6b23]/20">
              <ShieldAlert size={12} />
              Admin
            </span>
          ) : (
            <span className="text-gray-500 text-xs font-medium">Gestor</span>
          )}
        </td>
        <td className="px-6 py-4">
          <StatusBadge 
            status={user.status} 
            label={getStatusLabel(String(user.status))} 
          />
        </td>
        <td className="px-6 py-4 text-gray-500">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : "-"}
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-sm text-gray-500">Visualização de contas e permissões do sistema.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar usuário..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c6b23]/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Usuário</th>
                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Permissão</th>
                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}