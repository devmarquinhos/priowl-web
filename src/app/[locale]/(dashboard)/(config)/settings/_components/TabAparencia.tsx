"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Globe, Circle, CheckCircle2, Monitor } from "lucide-react";
import { salvarPreferenciasCookieAction } from "@/actions/user-actions";
import { usePrimaryColor } from "@/providers/ThemeProvider"; // 1. Import do hook

const ACCENT_COLORS = [
  { id: "primary", name: "Ouro", hex: "#D6A628", hover: "#B98C03" },
  { id: "secondary", name: "Cobre", hex: "#B85B33", hover: "#9B451F" },
  { id: "tertiary", name: "Bege", hex: "#8C7364", hover: "#4E4635" },
  { id: "muted", name: "Cinza", hex: "#5E5E5E", hover: "#3F3F3F" },
];

const getClientCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export function TabAparencia() {
  const { theme, setTheme } = useTheme();
  const { changePrimaryColor } = usePrimaryColor(); // 2. Consumo do contexto
  const [mounted, setMounted] = useState(false);
  const [activeColor, setActiveColor] = useState("primary");
  const [language, setLanguage] = useState("pt-BR");
  const [isLoading, setIsLoading] = useState(false);

  // Aplica a cor via Contexto + variáveis CSS de apoio (como o hover)
  const applyColor = useCallback((colorId: string) => {
    const color = ACCENT_COLORS.find(c => c.id === colorId) || ACCENT_COLORS[0];
    
    changePrimaryColor(color.hex); // Atualiza o estado global e a var --color-primary
    document.documentElement.style.setProperty("--color-primary-hover", color.hover);
    
    setActiveColor(colorId);
  }, [changePrimaryColor]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedColor = getClientCookie("priowl-accent") || "primary";
    const savedLang = getClientCookie("priowl-lang") || "pt-BR";
    setActiveColor(savedColor);
    setLanguage(savedLang);
    
    const color = ACCENT_COLORS.find(c => c.id === savedColor) || ACCENT_COLORS[0];
    changePrimaryColor(color.hex);
    document.documentElement.style.setProperty("--color-primary-hover", color.hover);
  }, [changePrimaryColor]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await salvarPreferenciasCookieAction({
        theme: theme || "system",
        accentColor: activeColor,
        language: language
      });
      alert("Preferências sincronizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao sincronizar preferências com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    const savedColor = getClientCookie("priowl-accent") || "primary";
    const savedLang = getClientCookie("priowl-lang") || "pt-BR";
    const savedTheme = getClientCookie("priowl-theme") || "system";
    
    setActiveColor(savedColor);
    setLanguage(savedLang);
    setTheme(savedTheme);
    
    const color = ACCENT_COLORS.find(c => c.id === savedColor) || ACCENT_COLORS[0];
    changePrimaryColor(color.hex);
    document.documentElement.style.setProperty("--color-primary-hover", color.hover);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Aparência do Priowl</h2>
        <p className="text-sm text-[var(--color-muted)]">Personalize como a plataforma se parece para você.</p>
      </div>
      
      {/* MODO DE EXIBIÇÃO */}
      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Modo de Exibição</h3>
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Opção Light */}
          <button 
            type="button"
            onClick={() => setTheme("light")}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setTheme("light"); }}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all relative text-left ${
              theme === "light" 
                ? "border-[var(--color-primary)] bg-[var(--card)] shadow-sm" 
                : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            <div className="absolute -bottom-3 -right-3 rounded-full bg-[var(--card)] p-1 shadow-sm">
              {theme === "light" ? (
                <CheckCircle2 className="text-[var(--color-primary)]" size={24} fill="currentColor" color="var(--card)" />
              ) : (
                <Circle className="text-[var(--border)]" size={24} fill="var(--background)" />
              )}
            </div>
            {/* Gráfico Simulado */}
            <div className="mb-4 h-32 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-2">
               <div className="mb-2 h-4 w-full rounded bg-[#FFFFFF] shadow-sm"></div>
               <div className="flex gap-2">
                 <div className="h-20 w-1/3 rounded bg-[#FFFFFF] shadow-sm"></div>
                 <div className="h-20 w-1/3 rounded bg-[#FFFFFF] shadow-sm"></div>
                 <div className="h-20 w-1/3 rounded bg-[#FFFFFF] shadow-sm"></div>
               </div>
            </div>
            <p className="font-bold text-[var(--foreground)]">Modo Claro</p>
            <p className="text-xs text-[var(--color-muted)]">Ideal para ambientes iluminados</p>
          </button>

          {/* Opção Dark */}
          <button 
            type="button"
            onClick={() => setTheme("dark")}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setTheme("dark"); }}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all relative text-left ${
              theme === "dark" 
                ? "border-[var(--color-primary)] bg-[var(--card)] shadow-sm" 
                : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            <div className="absolute -bottom-3 -right-3 rounded-full bg-[var(--card)] p-1 shadow-sm">
              {theme === "dark" ? (
                 <CheckCircle2 className="text-[var(--color-primary)]" size={24} fill="currentColor" color="var(--card)" />
              ) : (
                 <Circle className="text-[var(--border)]" size={24} fill="var(--background)" />
              )}
            </div>
            {/* Gráfico Simulado */}
            <div className="mb-4 h-32 rounded-md border border-[#374151] bg-[#1F2937] p-2">
               <div className="mb-2 h-4 w-full rounded bg-[#374151]"></div>
               <div className="flex gap-2">
                 <div className="h-20 w-1/3 rounded bg-[#374151]"></div>
                 <div className="h-20 w-1/3 rounded bg-[#374151]"></div>
                 <div className="h-20 w-1/3 rounded bg-[#374151]"></div>
               </div>
            </div>
            <p className="font-bold text-[var(--foreground)]">Modo Escuro</p>
            <p className="text-xs text-[var(--color-muted)]">Conforto visual para longas jornadas</p>
          </button>

          {/* Opção Sistema */}
          <button 
            type="button"
            onClick={() => setTheme("system")}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setTheme("system"); }}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all relative text-left ${
              theme === "system" 
                ? "border-[var(--color-primary)] bg-[var(--card)] shadow-sm" 
                : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--color-primary)]/50"
            }`}
          >
            <div className="absolute -bottom-3 -right-3 rounded-full bg-[var(--card)] p-1 shadow-sm">
              {theme === "system" ? (
                 <CheckCircle2 className="text-[var(--color-primary)]" size={24} fill="currentColor" color="var(--card)" />
              ) : (
                 <Circle className="text-[var(--border)]" size={24} fill="var(--background)" />
              )}
            </div>
            {/* Gráfico Simulado */}
            <div className="mb-4 flex h-32 overflow-hidden rounded-md border border-[#E5E7EB]">
               <div className="w-1/2 bg-[#F9FAFB] p-2">
                 <div className="mb-2 h-4 w-full rounded bg-[#FFFFFF] shadow-sm"></div>
                 <div className="flex flex-col gap-2">
                   <div className="h-6 w-full rounded bg-[#FFFFFF] shadow-sm"></div>
                   <div className="h-6 w-full rounded bg-[#FFFFFF] shadow-sm"></div>
                 </div>
               </div>
               <div className="w-1/2 border-l border-[#374151] bg-[#1F2937] p-2">
                 <div className="mb-2 h-4 w-full rounded bg-[#374151]"></div>
                 <div className="flex flex-col gap-2">
                   <div className="h-6 w-full rounded bg-[#374151]"></div>
                   <div className="h-6 w-full rounded bg-[#374151]"></div>
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Monitor size={16} className="text-[var(--foreground)]" />
               <p className="font-bold text-[var(--foreground)]">Sistema</p>
            </div>
            <p className="text-xs text-[var(--color-muted)]">Adapta-se ao dispositivo</p>
          </button>
        </div>
      </div>

      {/* IDIOMA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
            <Globe className="text-[var(--color-primary)]" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--foreground)]">Idioma da Interface</h3>
            <p className="text-sm text-[var(--color-muted)]">Escolha o idioma principal do seu dashboard.</p>
          </div>
        </div>
        <select 
          value={language}
          onChange={handleLanguageChange}
          className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Español</option>
        </select>
      </div>

      {/* TOM DE DESTAQUE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
         <div>
            <h3 className="font-bold text-[var(--foreground)]">Tom de Destaque</h3>
            <p className="text-sm text-[var(--color-muted)]">Ajuste a cor principal dos botões e links.</p>
          </div>
          <div className="flex gap-3">
             {ACCENT_COLORS.map((color) => (
               <button
                 type="button"
                 key={color.id}
                 onClick={() => applyColor(color.id)}
                 className={`h-10 w-10 rounded-full transition-transform hover:scale-110 ${
                   activeColor === color.id ? "ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--background)]" : ""
                 }`}
                 style={{ backgroundColor: color.hex }}
                 title={`Cor ${color.name}`}
               />
             ))}
          </div>
      </div>

      {/* AÇÕES */}
      <div className="flex justify-end gap-4 pt-4">
        {/* Agora o botão de Descartar tem utilidade real! */}
        <Button 
          variant="ghost" 
          onClick={handleDiscard}
          className="text-[var(--color-muted)] hover:bg-[var(--border)]/50"
        >
          Descartar alterações
        </Button>
        <Button 
          onClick={handleSavePreferences}
          disabled={isLoading}
          className=" border-none bg-[var(--color-primary)] px-8 text-white transition-all hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Salvando..." : "Salvar Preferências"}
        </Button>
      </div>
    </div>
  );
}