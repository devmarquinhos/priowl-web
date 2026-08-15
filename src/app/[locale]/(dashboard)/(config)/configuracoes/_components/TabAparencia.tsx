import { Button } from "@/components/ui/Button";
import { Globe, Circle, CheckCircle2 } from "lucide-react";

export function TabAparencia() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Aparência do Priowl</h2>
        <p className="text-sm text-gray-500">Personalize como a plataforma se parece para você.</p>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Modo de Exibição</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Opção Light */}
          <div className="cursor-pointer rounded-xl border-2 border-[#8A6D3B] bg-white p-4 shadow-sm relative">
            <div className="absolute -bottom-3 -right-3 rounded-full bg-white p-1">
              <CheckCircle2 className="text-[#8A6D3B]" size={24} fill="#8A6D3B" color="white" />
            </div>
            <div className="mb-4 h-32 rounded-md border border-gray-100 bg-[#F9FAFB] p-2">
               <div className="mb-2 h-4 w-full rounded bg-white shadow-sm"></div>
               <div className="flex gap-2">
                 <div className="h-20 w-1/3 rounded bg-white shadow-sm"></div>
                 <div className="h-20 w-1/3 rounded bg-white shadow-sm"></div>
                 <div className="h-20 w-1/3 rounded bg-white shadow-sm"></div>
               </div>
            </div>
            <p className="font-bold text-gray-900">Modo Claro</p>
            <p className="text-xs text-gray-500">Ideal para ambientes iluminados</p>
          </div>

          {/* Opção Dark */}
          <div className="cursor-pointer rounded-xl border-2 border-transparent bg-gray-50 p-4 hover:border-gray-200 relative">
            <div className="absolute -bottom-3 -right-3 rounded-full bg-white p-1">
              <Circle className="text-gray-300" size={24} />
            </div>
            <div className="mb-4 h-32 rounded-md bg-[#1F2937] p-2 border border-gray-800">
               <div className="mb-2 h-4 w-full rounded bg-[#374151]"></div>
               <div className="flex gap-2">
                 <div className="h-20 w-1/3 rounded bg-[#374151]"></div>
                 <div className="h-20 w-1/3 rounded bg-[#374151]"></div>
                 <div className="h-20 w-1/3 rounded bg-[#374151]"></div>
               </div>
            </div>
            <p className="font-bold text-gray-900">Modo Escuro</p>
            <p className="text-xs text-gray-500">Conforto visual para longas jornadas</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FDE68A]">
            <Globe className="text-[#8A6D3B]" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Idioma da Interface</h3>
            <p className="text-sm text-gray-500">Escolha o idioma principal do seu dashboard.</p>
          </div>
        </div>
        <select className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#8A6D3B] focus:ring-1 focus:ring-[#8A6D3B]">
          <option>Português (Brasil)</option>
          <option>English (US)</option>
          <option>Español</option>
        </select>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
         <div>
            <h3 className="font-bold text-gray-900">Tom de Destaque</h3>
            <p className="text-sm text-gray-500">Ajuste o brilho dos elementos dourados.</p>
          </div>
          <div className="flex gap-3">
             <button className="h-8 w-8 rounded-full border-2 border-[#8A6D3B] bg-[#B48E4B] ring-2 ring-white"></button>
             <button className="h-8 w-8 rounded-full bg-[#A855F7]"></button>
             <button className="h-8 w-8 rounded-full bg-[#10B981]"></button>
             <button className="h-8 w-8 rounded-full bg-[#3B82F6]"></button>
             <button className="h-8 w-8 rounded-full bg-[#6B7280]"></button>
          </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="ghost" className="text-gray-600 hover:bg-gray-100">Descartar alterações</Button>
        <Button className="bg-[#8A6D3B] text-white hover:bg-[#725a30] px-8">Salvar Preferências</Button>
      </div>
    </div>
  );
}