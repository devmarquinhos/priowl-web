"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Send, History, AlertCircle } from "lucide-react";
import Link from "next/link";
import { solicitarRecuperacaoSenhaAction } from "@/actions/auth-actions"; 

export default function EsqueciMinhaSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const result = await solicitarRecuperacaoSenhaAction(email);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.success) {
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Ícone e Cabeçalho */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDE6A6]">
            <History className="text-[#B98C03]" size={32} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Esqueceu sua senha?</h1>
          <p className="text-sm text-gray-500">
            Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-lg bg-green-50 p-4 text-center text-green-800 border border-green-200 mb-6">
            <p className="font-medium">Link enviado com sucesso!</p>
            <p className="text-sm mt-1">Verifique sua caixa de entrada e a pasta de spam.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 🔹 Exibição de Erro Customizada */}
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle size={16} className="shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600">
                E-mail
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-[#D6A628] focus:outline-none focus:ring-1 focus:ring-[#D6A628]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#D6A628] py-3 text-sm font-bold text-white transition-colors hover:bg-[#B98C03] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
              {!isLoading && <Send size={16} />}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth?mode=login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}