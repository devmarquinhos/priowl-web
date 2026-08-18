"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, CheckCircle2, Shield, KeyRound, AlertCircle } from "lucide-react";
import Link from "next/link";
import { redefinirSenhaEsquecidaAction } from "@/actions/auth-actions"; 

function RedefinirSenhaForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!token) {
      setErrorMessage("Token de redefinição ausente. Use o link enviado por e-mail.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    if (!hasMinLength || !hasMixedCase) {
      setErrorMessage("A senha não atende aos requisitos de segurança.");
      return;
    }

    setIsLoading(true);

    // 🔹 Chamada para a Server Action
    const result = await redefinirSenhaEsquecidaAction(token, password.trim());

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.success) {
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Senha redefinida!</h2>
        <p className="text-gray-500 mb-6">Sua senha foi alterada com sucesso.</p>
        <Link href="/auth?mode=login" className="block w-full rounded-md bg-[#D6A628] py-3 text-sm font-bold text-white transition-colors hover:bg-[#B98C03]">
          Ir para o Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Nova Senha */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">Nova Senha</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <KeyRound className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-10 text-sm placeholder-gray-400 focus:border-[#D6A628] focus:outline-none focus:ring-1 focus:ring-[#D6A628]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirmar Nova Senha */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">Confirmar Nova Senha</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <ShieldCheck className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-10 text-sm placeholder-gray-400 focus:border-[#D6A628] focus:outline-none focus:ring-1 focus:ring-[#D6A628]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Requisitos de Segurança */}
      <div className="rounded-md bg-gray-100 p-4 text-sm">
        <p className="font-bold text-gray-800 mb-2">Requisitos de segurança:</p>
        <ul className="space-y-1">
          <li className={`flex items-center gap-2 ${hasMinLength ? "text-[#B85B33]" : "text-gray-500"}`}>
            <CheckCircle2 size={16} /> Mínimo 8 caracteres
          </li>
          <li className={`flex items-center gap-2 ${hasMixedCase ? "text-[#B85B33]" : "text-gray-500"}`}>
            <CheckCircle2 size={16} /> Letras maiúsculas e minúsculas
          </li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={isLoading || !token}
        className="w-full rounded-md bg-[#D6A628] py-3 text-sm font-bold text-white transition-colors hover:bg-[#B98C03] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
      >
        {isLoading ? "Salvando..." : "Redefinir Senha"}
      </button>
    </form>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        
        {/* Ícone e Cabeçalho */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D6A628]">
            <KeyRound className="text-white" size={32} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Criar nova senha</h1>
          <p className="text-sm text-gray-500">
            Escolha uma senha forte para proteger sua conta.
          </p>
        </div>

        {/* Suspense é necessário no Next.js App Router ao usar useSearchParams */}
        <Suspense fallback={<div className="text-center py-4 text-gray-500">Carregando...</div>}>
          <RedefinirSenhaForm />
        </Suspense>

      </div>
      
      {/* Footer de Segurança */}
      <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
        <Shield size={16} className="text-gray-300" />
        <span>Protegido por Priowl Security</span>
      </div>
    </div>
  );
}