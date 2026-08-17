import { Button } from "@/components/ui/Button";
import { Send, Mail, MessageSquare, ChevronRight, Users, Shield, Clock, ThumbsUp } from "lucide-react";

export function TabSuporte() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid gap-8 md:grid-cols-3">
        
        {/* Central de Ajuda - Formulário */}
        <div className="col-span-2 rounded-xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Central de Ajuda</h2>
          <p className="mb-8 text-sm text-muted">Nossa equipe de especialistas está pronta para ajudar você com qualquer dúvida ou problema técnico.</p>
          
          <form className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Assunto</label>
              <select className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                <option>Dúvida Geral</option>
                <option>Problema Financeiro</option>
                <option>Suporte Técnico</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Sua Mensagem</label>
              <textarea 
                rows={5}
                placeholder="Descreva sua dúvida com o máximo de detalhes possível..."
                className="w-full resize-none rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              ></textarea>
            </div>
            <div className="flex items-center gap-4">
              <Button className="flex items-center gap-2 bg-primary px-8 py-6 text-base font-medium text-white hover:bg-primary-hover">
                Enviar Dúvida <Send size={18} />
              </Button>
              <p className="text-xs text-muted">Tempo médio de resposta: 2 horas<br/>úteis.</p>
            </div>
          </form>
        </div>

        {/* Painel Lateral Direito */}
        <div className="space-y-6">
          {/* Canais Diretos */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="mb-4 text-sm font-bold text-primary">Canais Diretos</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 shrink-0 text-primary" size={20} />
                <div>
                  <p className="text-sm text-primary/80">E-mail Corporativo</p>
                  <p className="font-bold text-primary">priowlsupport@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="mt-1 shrink-0 text-primary" size={20} />
                <div>
                  <p className="text-sm text-primary/80">Chat em Tempo Real</p>
                  <p className="font-bold text-primary">Ativo (Seg a Sex, 09h - 18h)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Artigos Populares */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-foreground">Artigos Populares</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-between border-b border-border pb-3 text-sm text-muted hover:text-primary transition-colors">
                Como gerenciar cobranças? <ChevronRight size={16} />
              </a>
              <a href="#" className="flex items-center justify-between border-b border-border pb-3 text-sm text-muted hover:text-primary transition-colors">
                Configurando notificações mobile <ChevronRight size={16} />
              </a>
              <a href="#" className="flex items-center justify-between text-sm text-muted hover:text-primary transition-colors">
                Integração com calendários <ChevronRight size={16} />
              </a>
            </div>
          </div>

          {/* Comunidade */}
          <div className="rounded-xl border border-border bg-background p-6 text-center shadow-sm">
             <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white">
                <Users size={24} />
             </div>
             <h4 className="font-bold text-foreground">Comunidade Priowl</h4>
             <p className="mb-4 text-xs text-muted">Troque experiências com 5k+ usuários.</p>
             <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 transition-colors">
               Acessar Fórum
             </Button>
          </div>
        </div>
      </div>

      {/* Banners Informativos de Rodapé */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <Shield className="text-primary" size={20} />
          <p className="text-xs text-muted">Sua privacidade é nossa prioridade absoluta.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <Clock className="text-primary" size={20} />
          <p className="text-xs text-muted">Suporte prioritário disponível para planos Pro.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <ThumbsUp className="text-primary" size={20} />
          <p className="text-xs text-muted">98% de satisfação nas resoluções de tickets.</p>
        </div>
      </div>

      <div className="pt-8 text-center">
        <p className="text-xs text-muted/60">© 2024 Priowl Task Management. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}