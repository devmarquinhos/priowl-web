"use client";

import { useState, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  RefreshCcw,
  Shield,
  AlertCircle
} from "lucide-react";

// 1. O Componente que contém o formulário e a lógica
function RedefinirSenhaForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Estados dos inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados de visualização
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados de feedback e requisição
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validações no Frontend
    if (!token) {
      setErrorMsg("Token de recuperação ausente ou inválido. Solicite um novo link.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      // Fazendo a ponte com o seu backend Spring Boot
      const response = await fetch("http://localhost:8080/api/auth/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: password,
        }),
      });

      if (!response.ok) {
        // Captura a mensagem de erro do backend (ex: "This link expired.")
        const errorData = await response.text();
        throw new Error(errorData || "Ocorreu um erro ao redefinir a senha.");
      }

      setSuccessMsg("Senha alterada com sucesso! Redirecionando...");
      
      // Redireciona para o login após 2 segundos
      setTimeout(() => {
        router.push("/login"); // Ajuste para a sua rota de login
      }, 2000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
      
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#A8821B] text-white">
          <RefreshCcw size={28} className={isLoading ? "animate-spin" : ""} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Redefinir sua senha</h1>
        <p className="px-4 text-sm text-gray-500">
          Escolha uma senha forte para proteger sua conta.
        </p>
      </div>

      {/* Exibição de Mensagens de Erro ou Sucesso */}
      {errorMsg && (
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-gray-600">Nova Senha</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 text-gray-600" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || !!successMsg}
              className="w-full rounded-lg border border-gray-200 bg-[#FBFBFB] py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-[#A8821B] focus:ring-1 focus:ring-[#A8821B] disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-gray-600">Confirmar Nova Senha</label>
          <div className="relative flex items-center">
            <ShieldCheck className="absolute left-3.5 text-gray-600" size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || !!successMsg}
              className="w-full rounded-lg border border-gray-200 bg-[#FBFBFB] py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-[#A8821B] focus:ring-1 focus:ring-[#A8821B] disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-[#F5F5F5] p-4">
          <h3 className="mb-2 text-xs font-bold text-gray-900">Requisitos de segurança:</h3>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 size={14} className={password.length >= 8 ? "text-[#A8821B]" : "text-gray-300"} />
              Mínimo 8 caracteres
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 size={14} className={/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? "text-[#A8821B]" : "text-gray-300"} />
              Letras maiúsculas e minúsculas
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!successMsg}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-[#A8821B] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#8F6E16] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Salvando..." : "Alterar Senha"}
        </button>
      </form>

      <div className="mt-8 border-t border-gray-100 pt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-[#A8821B] hover:underline">
          <ArrowLeft size={16} /> Voltar para o login
        </Link>
      </div>
    </div>
  );
}

// 2. A Página Principal que envolve o formulário em um Suspense
export default function RedefinirSenhaPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-4">
      <Suspense fallback={<div className="text-gray-500">Carregando formulário...</div>}>
        <RedefinirSenhaForm />
      </Suspense>

      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-white shadow-sm border border-gray-100">
          <Shield size={16} className="text-gray-300" fill="#F3F4F6" />
        </div>
        <div className="h-6 w-px bg-gray-300"></div>
        <span className="text-xs font-medium text-gray-400">
          Protegido por Priowl Security
        </span>
      </div>
    </div>
  );
}