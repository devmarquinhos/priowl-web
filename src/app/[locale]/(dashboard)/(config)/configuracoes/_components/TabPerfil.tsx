import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { atualizarPerfilAction } from "@/actions/user-actions";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { UserProfileResponse } from "@/types/user";
import Link from "next/link";

// Definimos o tipo das propriedades que este componente vai receber
interface TabPerfilProps {
  user: UserProfileResponse | null; // Substitua "any" pela interface correta do seu UserProfile, se tiver!
  fallback: string;
}

export function TabPerfil({ user, fallback }: TabPerfilProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Card de Perfil Principal */}
      <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <Avatar 
            alt={`Foto de Perfil de ${user?.username || "Usuário"}`}
            fallbackInitials={fallback} 
            size="lg" 
            className="h-24 w-24 text-2xl" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.username || "Usuário Não Identificado"}
          </h2>
          <p className="text-sm text-gray-500">Membro desde Outubro 2023 • São Paulo, Brasil</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-[#E5733C] px-3 py-1 text-xs font-semibold text-white">
              PREMIUM
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {user?.isAdmin === true ? "Administrador" : "Gestor de Projetos"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Formulários */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Dados Pessoais */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-gray-900">Dados Pessoais</h3>
          <form action={atualizarPerfilAction} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Nome de Usuário</label>
              <input 
                type="text" 
                name="username"
                defaultValue={user?.username || ""} 
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#8A6D3B] focus:ring-1 focus:ring-[#8A6D3B]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">E-mail Profissional</label>
              <input 
                type="email" 
                name="email"
                defaultValue={user?.email || ""} 
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#8A6D3B] focus:ring-1 focus:ring-[#8A6D3B]"
              />
            </div>
            <Button type="submit" className="mt-4 w-full bg-[#8A6D3B] py-6 text-base font-medium text-white hover:bg-[#725a30]">
              Salvar Alterações
            </Button>
          </form>
        </div>

        {/* Segurança */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-gray-900">Segurança</h3>
          <p className="mb-6 text-sm text-gray-600">
            Mantenha sua conta segura atualizando sua senha regularmente.
          </p>
          
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-gray-200 bg-[#FAFAFA] p-4 border-dashed">
            <ShieldCheck className="mt-0.5 text-[#8A6D3B]" size={20} />
            <div>
              <p className="text-sm font-bold text-gray-900">Autenticação de Dois Fatores</p>
              <p className="text-xs text-gray-500">Ativo via Google Authenticator</p>
            </div>
          </div>

          <Link href="/redefinir-senha" passHref className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2...">
              <RefreshCw size={18} />
              Alterar Senha
            </Button>
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="flex items-center justify-between rounded-xl border border-red-200 bg-[#FFF5F5] p-6">
        <div>
          <h3 className="text-base font-bold text-red-700">Encerrar Conta</h3>
          <p className="text-sm text-red-600/80">
            A exclusão da conta é permanente e removerá todos os seus dados e projetos.
          </p>
        </div>
        <Button variant="outline" className="border-red-300 px-6 text-red-600 hover:bg-red-50 hover:text-red-700">
          Excluir Conta
        </Button>
      </div>

    </div>
  );
}