"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

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
        <div className="w-full max-w-[380px]">
          
          <div className="flex flex-col items-center text-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="mb-1 text-[#121212]" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.58 3.51c-1.39-1.3-4.23-.93-6.6.7-1.12.77-2.07 1.69-2.73 2.5-3.08 1.4-5.26 3.6-6.19 6.22-1.22 3.42-.51 7.21.36 8.52.29.43.92.51 1.25.18l3.15-3.15c.31-.31.76-.36 1.12-.13l.87.52c.36.21.84.18 1.16-.09l1.86-1.57c.32-.27.42-.72.23-1.1l-.81-1.63c-.17-.34-.14-.76.08-1.07l1.7-2.42c.26-.37.76-.5 1.18-.3l1.86.87c.36.17.79.1.1.06-.21l2.42-2.1c.31-.27.42-.71.26-1.09l-1.01-2.44c-.16-.39-.08-.84.2-1.16l2.13-2.4c.56-.63.95-1.55.93-2.43-.01-.73-.24-1.35-.61-1.72z" />
            </svg>
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
                  <Link href="/recuperar-senha" className="text-xs font-semibold text-gray-500 hover:text-black underline decoration-1 underline-offset-2 transition-colors">
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
          <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl text-black">
             <path d="M30 40 Q 50 30 70 40 L 75 25 Q 70 30 65 28 Q 50 20 35 28 Q 30 30 25 25 Z" fill="currentColor"/>
             <path d="M30 40 C 30 60 45 65 50 70 C 55 65 70 60 70 40 C 65 45 55 45 50 40 C 45 45 35 45 30 40 Z" fill="currentColor"/>
             <circle cx="42" cy="48" r="4" fill="white"/>
             <circle cx="58" cy="48" r="4" fill="white"/>
             <circle cx="42" cy="48" r="1.5" fill="currentColor"/>
             <circle cx="58" cy="48" r="1.5" fill="currentColor"/>
             <path d="M50 52 L 47 57 L 53 57 Z" fill="white"/>
             <path d="M50 75 L 25 60 L 35 85 L 50 95 L 65 85 L 75 60 Z" fill="currentColor"/>
             <path d="M50 78 L 32 67 L 38 82 L 50 90 L 62 82 L 68 67 Z" fill="none" stroke="white" strokeWidth="2.5"/>
             <line x1="38" y1="71" x2="46" y2="76" stroke="white" strokeWidth="2"/>
             <line x1="40" y1="76" x2="48" y2="81" stroke="white" strokeWidth="2"/>
             <line x1="62" y1="71" x2="54" y2="76" stroke="white" strokeWidth="2"/>
             <line x1="60" y1="76" x2="52" y2="81" stroke="white" strokeWidth="2"/>
          </svg>
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