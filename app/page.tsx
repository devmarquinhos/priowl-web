import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
          backgroundSize: '4rem 4rem'
        }}
      />

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 lg:px-12 max-w-7xl w-full mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/feather-1.svg" 
              alt="Priowl Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="text-xl font-extrabold tracking-tight">Priowl</span>
          </Link>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <Link href="#about" className="hover:text-slate-600 transition-colors">About</Link>
            <Link href="#pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="#docs" className="hover:text-slate-600 transition-colors">Docs</Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-4 text-sm font-bold">
            <Link href="/login" className="hover:text-slate-600 transition-colors">
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-[#111111] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors"
            >
              Sign up
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center pt-20 pb-16 px-6 max-w-7xl mx-auto w-full">
          <div className="max-w-3xl text-center space-y-6 mb-12">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              Everything you need <br className="hidden lg:block" /> to manage tasks
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-700 max-w-2xl mx-auto font-medium">
              Priowl is a powerful personal compendium to help you organize, 
              categorize, and track your tasks efficiently at every stage of your workflow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/register" 
                className="bg-[#111111] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-colors w-full sm:w-auto"
              >
                Get Started
              </Link>
              <Link 
                href="#pricing" 
                className="bg-transparent text-slate-900 border border-slate-300 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto"
              >
                Know the Plans
              </Link>
            </div>

            <div className="pt-8">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-6 py-2 text-sm font-medium shadow-sm">
                <span className="italic">Enterprise</span> needs?{" "}
                <a href="#contact" className="underline font-bold hover:text-slate-600">Talk to our team</a>
              </div>
            </div>
          </div>

          {/* Feature 1 */}
          <div className="w-full grid lg:grid-cols-2 gap-12 items-center py-16">
            <div className="bg-slate-200 rounded-2xl aspect-[4/3] w-full shadow-inner">
              {/* Placeholder para a imagem/dashboard do app */}
            </div>
            <div className="space-y-4 max-w-lg lg:pl-8">
              <h2 className="text-3xl lg:text-4xl font-bold">#1 ToDo List App</h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                Organize your tasks and subtasks by priority and category in an agile way. 
                The system offers complete control over your workflow with intelligent filters 
                focused on deadlines.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="w-full grid lg:grid-cols-2 gap-12 items-center py-16">
            <div className="space-y-4 max-w-lg order-2 lg:order-1">
              <h2 className="text-3xl lg:text-4xl font-bold">Analytics</h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                Track all your progress and have access to a complete dashboard for data analytics. 
                Need a formal report? We got you, PDF reports is possible.
              </p>
            </div>
            <div className="bg-slate-200 rounded-2xl aspect-[4/3] w-full shadow-inner order-1 lg:order-2">
              {/* Placeholder para a imagem de analytics */}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white relative z-10">
          <div className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Footer Logo */}
            <div className="flex flex-col items-start justify-center border-r border-slate-100 pr-8">
              <Image 
                src="/logo-1.svg" 
                alt="Priowl Logo" 
                width={100} 
                height={100} 
                className="mb-4 object-contain"
              />
              <span className="text-4xl font-extrabold tracking-tight">Priowl</span>
            </div>

            {/* Footer Links */}
            <div className="flex flex-col justify-center space-y-4 font-bold">
              <Link href="#about" className="hover:text-slate-600 transition-colors">About</Link>
              <Link href="#pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
              <Link href="#docs" className="hover:text-slate-600 transition-colors">Documentation</Link>
              <Link href="#contact" className="hover:text-slate-600 transition-colors">Contact Us</Link>
            </div>

            {/* Footer Credits */}
            <div className="flex flex-col justify-between font-bold text-slate-900">
              <p className="text-lg leading-snug">
                All rights reserved for Marcos Emanuel and Melkysedeke Costa
              </p>
              <div className="flex items-center justify-between mt-8 pt-4">
                <div className="space-x-4">
                  <Link href="#terms" className="hover:text-slate-600 transition-colors">Terms</Link>
                  <Link href="#contact" className="hover:text-slate-600 transition-colors">Contact</Link>
                </div>
                <span>2026</span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}