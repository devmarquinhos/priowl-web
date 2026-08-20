"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:8080";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const mode = searchParams.get("mode");
  const isLogin = mode === "login";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleView = () => {
    setErrorMsg("");
    setSuccessMsg("");
    
    const newMode = isLogin ? "signup" : "login";
    router.push(`${pathname}?mode=${newMode}`, { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      const payload = isLogin 
        ? { email, password }
        : { username: name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Ocorreu um erro inesperado.");
      }

      if (isLogin) {
        router.push("/dashboard");
      } else {
        setSuccessMsg("Conta criada com sucesso! Faça login para continuar.");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push(`${pathname}?mode=login`, { scroll: false });
        }, 2000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderButtonContent = () => {
    if (loading) {
      return (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    return isLogin ? "Fazer Login" : "Se cadastrar";
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#121212]">
      
      {/* ================= LADO ESQUERDO (FORMULÁRIO) ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 transition-all duration-500 relative z-10">
        
        {/* NOVO: Botão Voltar para a Home */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-black transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar para a Home
        </Link>

        <div className="w-full max-w-[380px]">
          
          <div className="flex flex-col items-center text-center mb-6">
            <Image 
                  src="feather-1.svg" 
                  alt="Logo Priowl" 
                  width={28} 
                  height={28} 
                  className="rounded"
                />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Priowl</h1>
                      
            <h2 className="text-lg font-semibold">
              {isLogin ? (
                <>
                  <span className="relative inline-block z-10">
                    Bem-vindo
                    <span className="absolute bottom-1 left-0 w-full h-[8px] bg-[#8B7365]/80 -z-10 mix-blend-multiply"></span>
                  </span>
                  {" de volta"}
                </>
              ) : (
                <>
                  {"Comece a "}
                  <span className="relative inline-block z-10 italic">
                    priowlrizar
                    <span className="absolute bottom-1 left-0 w-full h-[10px] bg-[#C89B3C]/80 -z-10 mix-blend-multiply"></span>
                  </span>
                  {" suas atividades"}
                </>
              )}
            </h2>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm text-center font-medium">
              {successMsg}
            </div>
          )}

          <form className="space-y-3 w-full" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label htmlFor="name" className="block text-sm font-bold text-[#121212]">Nome</label>
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Insira seu nome" 
                  required={!isLogin}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-bold text-[#121212]">E-mail</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isLogin ? "Insira seu e-mail" : "Insira seu melhor e-mail"} 
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-bold text-[#121212]">Senha</label>
                {isLogin && (
                  <Link href="/recover-password" className="text-xs font-semibold text-gray-500 hover:text-black underline decoration-1 underline-offset-2 transition-colors">
                    Esqueceu sua senha?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insira sua senha" 
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <EyeIcon closed={!showPassword} />
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label htmlFor="confirm-password" className="block text-sm font-bold text-[#121212]">Confirme sua senha</label>
                <div className="relative">
                  <input 
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha" 
                    required={!isLogin}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-400 text-sm font-medium pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <EyeIcon closed={!showConfirmPassword} />
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center bg-[#121212] hover:bg-black text-white font-bold py-2.5 rounded-lg mt-5 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {renderButtonContent()}
            </button>
          </form>

          <div className="text-center mt-6 text-sm font-medium text-gray-500">
            {isLogin ? (
              <p>
                {"Não possui uma conta? "}
                <button type="button" onClick={toggleView} className="text-[#121212] font-bold italic hover:underline">Se cadastrar</button>
              </p>
            ) : (
              <p>
                {"Já possui uma conta? "}
                <button type="button" onClick={toggleView} className="text-[#121212] font-bold italic hover:underline">Fazer Login</button>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ================= LADO DIREITO (DECORATIVO) ================= */}
      <div className={`hidden lg:flex lg:w-1/2 my-4 mr-4 rounded-[32px] relative overflow-hidden transition-colors duration-700 ease-in-out ${isLogin ? 'bg-[#8B7365]' : 'bg-[#C89B3C]'}`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 15c-3 5-8 10-15 12 2-5 3-10 1-15 8 2 12-2 14 3zm60 60c-3 5-8 10-15 12 2-5 3-10 1-15 8 2 12-2 14 3z' fill='%23000000' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Image 
                  src="logo-1.svg" 
                  alt="Logo Priowl" 
                  width={200} 
                  height={200} 
                  className="rounded"
                />
        </div>
      </div>
      
    </div>
  );
}

export default function AuthScreen() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AuthContent />
    </Suspense>
  );
}

function EyeIcon({ closed }: { readonly closed: boolean }) {
  if (closed) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}