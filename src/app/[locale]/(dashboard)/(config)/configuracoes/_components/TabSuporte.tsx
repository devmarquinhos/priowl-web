import { Button } from "@/components/ui/Button";
import { Send, Mail, MessageSquare, ChevronRight, Users, Shield, Clock, ThumbsUp } from "lucide-react";

export function TabSuporte() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid gap-8 md:grid-cols-3">
        
        {/* Central de Ajuda - Formulário */}
        <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Central de Ajuda</h2>
          <p className="mb-8 text-sm text-gray-500">Nossa equipe de especialistas está pronta para ajudar você com qualquer dúvida ou problema técnico.</p>
          
          <form className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Assunto</label>
              <select className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#8A6D3B] focus:ring-1 focus:ring-[#8A6D3B]">
                <option>Dúvida Geral</option>
                <option>Problema Financeiro</option>
                <option>Suporte Técnico</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Sua Mensagem</label>
              <textarea 
                rows={5}
                placeholder="Descreva sua dúvida com o máximo de detalhes possível..."
                className="w-full resize-none rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#8A6D3B] focus:ring-1 focus:ring-[#8A6D3B]"
              ></textarea>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-[#8A6D3B] px-8 py-6 text-base font-medium text-white hover:bg-[#725a30] flex items-center gap-2">
                Enviar Dúvida <Send size={18} />
              </Button>
              <p className="text-xs text-gray-500">Tempo médio de resposta: 2 horas<br/>úteis.</p>
            </div>
          </form>
        </div>

        {/* Painel Lateral Direito */}
        <div className="space-y-6">
          {/* Canais Diretos */}
          <div className="rounded-xl border border-[#FDE68A] bg-[#FEF9C3] p-6">
            <h3 className="mb-4 text-sm font-bold text-[#8A6D3B]">Canais Diretos</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 shrink-0 text-[#8A6D3B]" size={20} />
                <div>
                  <p className="text-sm text-[#8A6D3B]/80">E-mail Corporativo</p>
                  <p className="font-bold text-[#8A6D3B]">premium@priowl.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-1 shrink-0 text-[#8A6D3B]" size={20} />
                <div>
                  <p className="text-sm text-[#8A6D3B]/80">Chat em Tempo Real</p>
                  <p className="font-bold text-[#8A6D3B]">Ativo (Seg a Sex, 09h - 18h)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Artigos Populares */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-gray-900">Artigos Populares</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm text-gray-600 hover:text-[#8A6D3B]">
                Como gerenciar cobranças? <ChevronRight size={16} />
              </a>
              <a href="#" className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm text-gray-600 hover:text-[#8A6D3B]">
                Configurando notificações mobile <ChevronRight size={16} />
              </a>
              <a href="#" className="flex items-center justify-between text-sm text-gray-600 hover:text-[#8A6D3B]">
                Integração com calendários <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* Comunidade */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm text-center">
             <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E5733C] text-white">
                <Users size={24} />
             </div>
             <h4 className="font-bold text-gray-900">Comunidade Priowl</h4>
             <p className="mb-4 text-xs text-gray-500">Troque experiências com 5k+ usuários.</p>
             <Button variant="outline" className="w-full border-[#8A6D3B] text-[#8A6D3B] hover:bg-[#FDFBF7]">Acessar Fórum</Button>
          </div>
        </div>
      </div>

      {/* Banners Informativos de Rodapé */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
          <Shield className="text-[#8A6D3B]" size={20} />
          <p className="text-xs text-gray-600">Sua privacidade é nossa prioridade absoluta.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
          <Clock className="text-[#8A6D3B]" size={20} />
          <p className="text-xs text-gray-600">Suporte prioritário disponível para planos Pro.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
          <ThumbsUp className="text-[#8A6D3B]" size={20} />
          <p className="text-xs text-gray-600">98% de satisfação nas resoluções de tickets.</p>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs text-gray-400">© 2024 Priowl Task Management. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}