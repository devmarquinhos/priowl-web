"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { alterarSenhaAction } from "@/actions/user-actions";

export default function AlterarSenhaPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validações
  const hasMinLength = newPassword.length >= 8;
  const hasMixedCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("As novas senhas não coincidem.");
      return;
    }

    if (!hasMinLength || !hasMixedCase) {
      setErrorMessage("A nova senha não atende aos requisitos de segurança.");
      return;
    }

    setIsLoading(true);

    const result = await alterarSenhaAction(currentPassword, newPassword);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.success) {
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="text-green-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Senha alterada!</h2>
          <p className="text-xs text-gray-500 mb-5">Sua senha foi atualizada com sucesso.</p>
          <button 
            onClick={() => router.push("/settings?aba=perfil")} 
            className="block w-full rounded-md bg-[#D6A628] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#B98C03]"
          >
            Voltar ao Perfil
          </button>
        </div>
      </div>
    );
  }

  // Formulário Principal
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        
        {/* Ícone e Cabeçalho */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D6A628]">
            <KeyRound className="text-white" size={24} />
          </div>
          <h1 className="mb-1 text-xl font-bold text-gray-900">Alterar Palavra-passe</h1>
          <p className="text-xs text-gray-500">
            Digite sua senha atual e escolha uma nova.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-xs text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Senha Atual */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Senha Atual</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2.5 pl-9 pr-9 text-sm placeholder-gray-400 focus:border-[#D6A628] focus:outline-none focus:ring-1 focus:ring-[#D6A628]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nova Senha */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Nova Senha</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2.5 pl-9 pr-9 text-sm placeholder-gray-400 focus:border-[#D6A628] focus:outline-none focus:ring-1 focus:ring-[#D6A628]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirmar Nova Senha */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Confirmar Nova Senha</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2.5 pl-9 pr-9 text-sm placeholder-gray-400 focus:border-[#D6A628] focus:outline-none focus:ring-1 focus:ring-[#D6A628]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Requisitos de Segurança */}
          <div className="rounded-md bg-gray-100 p-3 text-xs">
            <p className="font-bold text-gray-800 mb-1.5">Requisitos de segurança:</p>
            <ul className="space-y-1">
              <li className={`flex items-center gap-1.5 ${hasMinLength ? "text-[#B85B33]" : "text-gray-500"}`}>
                <CheckCircle2 size={14} /> Mínimo 8 caracteres
              </li>
              <li className={`flex items-center gap-1.5 ${hasMixedCase ? "text-[#B85B33]" : "text-gray-500"}`}>
                <CheckCircle2 size={14} /> Letras maiúsculas e minúsculas
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full rounded-md bg-[#D6A628] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#B98C03] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Salvando..." : "Alterar Senha"}
          </button>

          <div className="mt-4 text-center">
            <Link href="/settings?aba=perfil" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={14} /> Voltar ao Perfil
            </Link>
          </div>
        </form>

      </div>
      
      {/* Footer de Segurança */}
      <div className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Shield size={14} className="text-gray-300" />
        <span>Protegido por Priowl Security</span>
      </div>
    </div>
  );
}