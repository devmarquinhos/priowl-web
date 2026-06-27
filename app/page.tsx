"use client"
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // login
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || 'Falha na autenticação.');
          return;
        }

        console.log("Successful Login");
        // window.location.href = '/dashboard'; 
        
      } else {
        console.log("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error, try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ease-in-out text-slate-900 ${
      isLogin ? 'bg-[#F2FCF3]' : 'bg-[#FFF8EE]'
    }`}>
      
      {/* blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div 
          className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 transition-colors duration-700 ease-in-out -translate-x-1/2 -translate-y-1/2 ${
            isLogin ? 'bg-[#DCFCE7]' : 'bg-[#FFE5B4]'
          }`} 
        />
        <div 
          className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 transition-colors duration-700 ease-in-out translate-x-1/3 translate-y-1/3 ${
            isLogin ? 'bg-[#bbf7d0]' : 'bg-[#FFDDA1]'
          }`} 
        />

        <div 
          className={`absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-50 transition-colors duration-700 ease-in-out -translate-x-1/2 -translate-y-1/2 ${
            isLogin ? 'bg-[#86efac]' : 'bg-[#FFC96F]'
          }`} 
        />

        {/* feather pattern (mobile) */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `url("/feather-1.svg")`,
            backgroundSize: '120px 120px',
            transform: 'rotate(-15deg) scale(2.0)'
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-2">
        {/* left side */}
        <div className="flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 min-h-screen lg:bg-white transition-colors duration-700">
          
          <div className="w-full max-w-sm">
            {/* feather icon */}
            <div className="flex flex-col items-center justify-center mb-10">
              <Image 
                src="/feather-1.svg"
                alt='Feather Logo'
                width={80}
                height={80}
                priority
                className="mb-2"
              />
              <h1 className="text-4xl font-extrabold tracking-tight">Priowl</h1>
            </div>

            {/* title */}
            <h2 className="text-2xl font-bold text-center mb-8">
              {isLogin ? 'Welcome Back' : 'Start priowlritizing your tasks'}
            </h2>

            {/* form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* name input */}
              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold mb-1.5" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors placeholder:text-slate-400"
                    required
                  />
                </div>
              )}

              {/* email input */}
              <div>
                <label className="block text-sm font-bold mb-1.5" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your e-mail"
                  className="w-full px-4 py-3 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors placeholder:text-slate-400"
                  required
                />
              </div>

              {/* password input */}
              <div>
                <label className="block text-sm font-bold mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* repeat password input */}
              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold mb-1.5" htmlFor="repeat-password">
                    Repeat password
                  </label>
                  <div className="relative">
                    <input
                      id="repeat-password"
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full pl-4 pr-12 py-3 bg-white/90 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors placeholder:text-slate-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showRepeatPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-slate-200/50"
                >
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </form>

            {/* redirects to sign in page */}
            <div className="mt-8 text-center text-sm text-slate-600">
              {isLogin ? "Doesn't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-slate-900 underline hover:text-slate-700 transition-colors focus:outline-none"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>

          </div>
        </div>

        {/* Priowl Logo */}
        <div className="hidden lg:flex relative flex-col justify-center items-center">
          <div className="relative z-10 animate-in fade-in zoom-in duration-700">
            <Image 
              src="/logo-1.svg" 
              alt="Coruja Lendo" 
              width={400}
              height={400}
              priority
              className="object-contain drop-shadow-2xl" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}