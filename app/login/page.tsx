"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. Importando o roteador do Next.js

export default function Login() {
  const router = useRouter(); // 2. Inicializando o roteador

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // 3. Apontando para o backend na porta 8080
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Credenciais inválidas.');

      // 4. Salvando o Token JWT no navegador
      // O Spring Boot costuma retornar {"token": "..."} ou apenas o token em string.
      // Essa lógica cobre os dois cenários:
      if (data.token) {
        localStorage.setItem('priowl_token', data.token);
      } else if (typeof data === 'string') {
        localStorage.setItem('priowl_token', data);
      }

      setSuccessMessage('Login realizado! Redirecionando...');
      
      // 5. Redirecionando com delay de 1.5s
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Erro de comunicação com o servidor');
      }
      setIsLoading(false); // Só desativa o loading em caso de erro
    }
  };

  return (
    <div className="h-[100dvh] relative overflow-hidden bg-[#F2FCF3] text-slate-900">


      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Blob do Topo (Agora posicionado na DIREITA) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 bg-[#DCFCE7] translate-x-1/3 -translate-y-1/3 animate-blob-fade delay-1300" />
      {/* Blob Inferior (Mantido igual) */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 bg-[#bbf7d0] translate-x-1/3 translate-y-1/3 animate-blob-fade delay-1500" />
      {/* Blob Central (Mantido igual) */}
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-50 bg-[#86efac] -translate-x-1/2 -translate-y-1/2 animate-blob-fade delay-1700" />
      <div className="absolute inset-0 opacity-[0.03] lg:hidden" style={{ backgroundImage: `url("/feather-1.svg")`, backgroundSize: '120px 120px', transform: 'rotate(-15deg) scale(2.0)' }} />
    </div>

      <div className="relative z-10 h-full flex flex-col lg:grid lg:grid-cols-2">
        
        {/* LADO ESQUERDO */}
        <div className="relative flex flex-col justify-center items-center px-6 h-full lg:bg-white">
          
          {/* Botão de Retorno à Home */}
          <Link 
            href="/" 
            className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          <div className="w-full max-w-sm">
            
            <div className="flex flex-col items-center justify-center mb-5 lg:mb-6">
              <Image src="/feather-1.svg" alt='Feather Logo' width={44} height={44} priority className="lg:w-12 lg:h-12 rotate-30" />
              <h1 className="text-3xl font-extrabold tracking-tight">Priowl</h1>
            </div>

            <h2 className="text-lg lg:text-xl font-bold text-center mb-6 lg:mb-8">
              Welcome Back
            </h2>

            {errorMessage && (
              <div className="mb-3 p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-bold animate-in fade-in">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-3 p-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs text-center font-bold animate-in fade-in">
                {successMessage}
              </div>
            )}

            <form className="space-y-4 lg:space-y-5" onSubmit={handleSubmit}>
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs lg:text-sm font-bold mb-1 lg:mb-1.5" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your e-mail"
                  className="w-full px-4 py-2.5 lg:py-3 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-slate-300 text-sm"
                  required
                />
              </div>

              <div className="animate-in fade-in slide-in-from-top-2 duration-300 delay-75">
                <label className="block text-xs lg:text-sm font-bold mb-1 lg:mb-1.5" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 lg:py-3 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder:text-slate-300 text-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 focus:outline-none">
                    {showPassword ? <Eye className="w-4 h-4 lg:w-5 lg:h-5" /> : <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 lg:pt-4 animate-in fade-in slide-in-from-top-2 duration-300 delay-150">
                <button type="submit" disabled={isLoading} className="w-full bg-[#111111] hover:bg-black disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-slate-200/50 text-sm lg:text-base">
                  {isLoading ? 'Processing...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-6 lg:mt-8 text-center text-xs lg:text-sm font-medium text-slate-400 animate-in fade-in duration-500 delay-300">
              Doesn&apos;t have an account?{" "}
              <Link href="/register" className="font-bold italic underline text-slate-900 hover:text-slate-700">
                Sign Up
              </Link>
            </div>

          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="hidden lg:flex relative flex-col justify-center items-center overflow-hidden h-full">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("/feather-1.svg")`, backgroundSize: '150px 150px', transform: 'rotate(-25deg) scale(1.2)' }} />
          <div className="relative z-10 animate-in fade-in zoom-in duration-700">
            <Image src="/logo-1.svg" alt="Logo Priowl" width={260} height={260} priority className="object-contain drop-shadow-xl" />
          </div>
        </div>

      </div>
    </div>
  );
}