import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { getUserProfile } from "@/services/user";
import Link from "next/link";
import { atualizarPerfilAction } from "@/actions/user-actions";
import { 
  ShieldCheck, Lock, AlertTriangle, Globe, Circle, CheckCircle2, 
  Download, FileText, RefreshCw, Send, Mail, MessageSquare, 
  ChevronRight, Users, Shield, Clock, ThumbsUp, Medal, Gift, Check
} from "lucide-react";
import { TabPerfil } from "./_components/TabPerfil";
import { TabAparencia } from "./_components/TabAparencia";
import { TabAssinatura } from "./_components/TabAssinatura";
import { TabSuporte } from "./_components/TabSuporte";

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string }>;
}) {
  const user = await getUserProfile();
  const fallback = user?.username ? user.username.substring(0, 2).toUpperCase() : "US";

  const params = await searchParams;
  const abaAtual = params.aba || "perfil";

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      
      {/* 1. Abas de Navegação (Tabs) */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8 overflow-x-auto">
          <Link 
            href="?aba=perfil"
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
              abaAtual === "perfil" ? "border-[#8A6D3B] text-[#8A6D3B]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Meu Perfil
          </Link>
          <Link 
            href="?aba=aparencia"
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
              abaAtual === "aparencia" ? "border-[#8A6D3B] text-[#8A6D3B]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Aparência
          </Link>
          <Link 
            href="?aba=assinatura"
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
              abaAtual === "assinatura" ? "border-[#8A6D3B] text-[#8A6D3B]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Assinatura e Planos
          </Link>
          <Link 
            href="?aba=suporte"
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium ${
              abaAtual === "suporte" ? "border-[#8A6D3B] text-[#8A6D3B]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Suporte e Contato
          </Link>
        </nav>
      </div>

      {abaAtual === "perfil" && <TabPerfil user={user} fallback={fallback} />}
      {abaAtual === "aparencia" && <TabAparencia />}
      {abaAtual === "assinatura" && <TabAssinatura />}
      {abaAtual === "suporte" && <TabSuporte />}

    </div>
  );
}