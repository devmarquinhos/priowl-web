import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/Button";

export default function Home() {
  const t = useTranslations("Landing");

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#121212] font-sans selection:bg-[#F2C94C]/30 relative overflow-hidden">
      
      {/* ================= BACKGROUND DINÂMICO ================= */}
      {/* Padrão de Pontos (Dots) sutil */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#8A6727 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }} 
      />
      
      {/* Luzes ambientes (Glows) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F2C94C]/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#8A6727]/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] bg-[#F2C94C]/5 blur-[150px] rounded-full pointer-events-none z-0" />
      {/* ======================================================= */}

      {/* NAVBAR - Agora com Backdrop Blur (Glassmorphism) */}
      <header className="w-full bg-[#FCFBF9]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#EAEAEA]/50 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 grid grid-cols-3 items-center">
          
          {/* Esquerda: Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
                <Image 
                  src="logo-1.svg" 
                  alt="Logo Priowl" 
                  width={32} 
                  height={32} 
                  className="rounded"
                />
              <span className="tracking-tight text-[#8A6727]">Priowl</span>
            </Link>
          </div>
          
          {/* Centro: Navegação */}
          <nav className="hidden md:flex justify-center gap-8 text-xs font-bold text-[#5E5E5E]">
            <Link href="#sobre" className="hover:text-[#121212] transition-colors">Sobre</Link>
            <Link href="#funcionalidades" className="hover:text-[#121212] transition-colors">Funcionalidades</Link>
            <Link href="/plans" className="hover:text-[#121212] transition-colors">Preços/Planos</Link>
            <Link href="#docs" className="hover:text-[#121212] transition-colors">Docs</Link>
          </nav>
          
          {/* Direita: Autenticação */}
          <div className="flex items-center justify-end gap-5">
            <Link href="/auth?mode=login" className="text-xs font-bold text-[#5E5E5E] hover:text-[#121212] transition-colors">
              Entrar
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="px-6 py-2 text-xs font-bold bg-[#8A6727] hover:bg-[#73551F] text-white rounded transition-colors border-none shadow-none">
                Cadastrar
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* Main precisa ter relative e z-10 para ficar acima do background animado */}
      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative max-w-4xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center overflow-visible">
          {/* Glow de fundo mantido, mas ajustado para mesclar com as novas luzes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F2C94C]/15 blur-[100px] rounded-full -z-10 pointer-events-none" />

          <h1 className="text-5xl md:text-[56px] font-black tracking-tight leading-[1.1] mb-6 text-[#121212]">
            Tudo o que você precisa<br />
            para <span className="bg-[#F2C94C] px-2 rounded-md inline-block transform -rotate-1 shadow-sm">gerenciar tarefas</span>
          </h1>
          <p className="text-sm md:text-base text-[#5E5E5E] max-w-xl mb-10 font-medium leading-relaxed">
            Priowl é o seu compêndio pessoal para organizar, categorizar e
            acompanhar suas tarefas com eficiência em todas as etapas do seu
            fluxo de trabalho.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <Link href="/auth?mode=signup">
              <Button className="px-8 py-3.5 text-sm font-bold bg-[#8A6727] hover:bg-[#73551F] text-white rounded transition-colors border-none shadow-lg shadow-[#8A6727]/20">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/plans">
              <Button variant="outline" className="px-8 py-3.5 text-sm font-bold border border-[#EAEAEA] hover:bg-[#F9F7F5] text-[#121212] rounded transition-colors bg-white/80 backdrop-blur-sm shadow-sm">
                Conhecer Planos
              </Button>
            </Link>
          </div>
          
          {/* Link Corporativo Pill */}
          <div className="inline-flex items-center gap-2 px-5 py-2 border border-[#EAEAEA] rounded-full text-xs font-medium text-[#5E5E5E] bg-white/80 backdrop-blur-sm shadow-sm">
            <span>Necessidades corporativas?</span>
            <Link href="/contato" className="font-bold text-[#121212] underline decoration-1 decoration-[#F2C94C] underline-offset-4 hover:opacity-70 transition-opacity">
              Fale com nosso time
            </Link>
          </div>
        </section>

        {/* FUNCIONALIDADES - TO DO LIST */}
        <section id="funcionalidades" className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Gráfico do App de To do List recriado */}
            <div className="w-full bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#F4F1ED] relative overflow-hidden h-[300px] flex flex-col gap-4 justify-center">
              {/* Item 1 - Prioridade */}
              <div className="flex items-center justify-between border border-[#F4F1ED] p-3 rounded-lg shadow-sm bg-white relative z-10 hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#F2C94C]" />
                  <div className="w-24 h-2 bg-[#EAEAEA] rounded-full" />
                </div>
                <div className="bg-[#F2C94C] text-[#8A6727] text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-wider">
                  PRIORIDADE
                </div>
              </div>
              
              {/* Item 2 - Concluído */}
              <div className="flex items-center justify-between border border-[#F4F1ED] p-3 rounded-lg shadow-sm bg-white relative z-10 hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#F2C94C] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="w-16 h-2 bg-[#EAEAEA] rounded-full" />
                </div>
              </div>

              {/* Item 3 - Padrão */}
              <div className="flex items-center justify-between border border-[#F4F1ED] p-3 rounded-lg shadow-sm bg-white relative z-10 hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#EAEAEA]" />
                  <div className="w-32 h-2 bg-[#EAEAEA] rounded-full" />
                </div>
              </div>

              {/* Detalhe visual (quadrado amarelo no canto) */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#FDF7E1] rounded-tl-xl z-0" />
            </div>

            {/* Textos */}
            <div>
              <h2 className="text-3xl font-black mb-4 tracking-tight flex items-center gap-2">
                <span className="text-[#F2C94C]">#1</span> App de ToDo List
              </h2>
              <p className="text-sm text-[#5E5E5E] mb-8 leading-relaxed">
                Organize suas tarefas e subtarefas por prioridade e categoria de
                forma ágil. Nosso sistema oferece controle total sobre seu fluxo com
                filtros inteligentes focados em prazos.
              </p>
              <ul className="space-y-3">
                {[
                  'Ordenação Inteligente de Prazos', 
                  'Hierarquias Profundas de Subtarefas', 
                  'Visualização em Listas'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs font-bold text-[#121212]">
                    <span className="w-1.5 h-1.5 bg-[#8A6727]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES - ANÁLISE DE DADOS */}
        <section className="max-w-5xl mx-auto px-6 py-20 pb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Textos (agora na esquerda) */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-black mb-4 tracking-tight">Análise de Dados</h2>
              <p className="text-sm text-[#5E5E5E] mb-6 leading-relaxed">
                Acompanhe todo o seu progresso e tenha acesso a um painel
                completo para análise de dados. Precisa de um relatório formal?
                Oferecemos exportação completa para PDF.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-[#8A6727] hover:opacity-70 transition-opacity">
                Explorar Painel <span className="font-normal transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Gráfico (agora na direita) */}
            <div className="order-1 md:order-2 w-full bg-white/90 backdrop-blur-md rounded-xl p-8 flex flex-col justify-end shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#F4F1ED] relative h-[320px]">
              
              {/* Barras */}
              <div className="flex items-end justify-between gap-2 h-full border-b-2 border-[#EAEAEA] pb-4 mb-4">
                <div className="w-full bg-[#EAEAEA] h-[25%] rounded-t-sm hover:h-[30%] transition-all duration-300" />
                <div className="w-full bg-[#F2C94C] h-[50%] rounded-t-sm hover:h-[55%] transition-all duration-300" />
                <div className="w-full bg-[#EAEAEA] h-[35%] rounded-t-sm hover:h-[40%] transition-all duration-300" />
                <div className="w-full bg-[#121212] h-[75%] rounded-t-sm hover:h-[80%] transition-all duration-300 shadow-lg" />
                <div className="w-full bg-[#F2C94C] h-[45%] rounded-t-sm hover:h-[50%] transition-all duration-300" />
              </div>
              
              {/* Rodapé do Gráfico */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] font-bold text-[#5E5E5E] uppercase tracking-widest mb-1">
                    PRODUTIVIDADE TOTAL
                  </p>
                  <p className="text-2xl font-black tracking-tight">+42%</p>
                </div>
                <button type="button" className="w-8 h-8 bg-[#F4F1ED] hover:bg-[#EAEAEA] transition-colors rounded-md flex items-center justify-center" aria-label="Ver mais">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#EAEAEA] bg-white/80 backdrop-blur-md pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            
            {/* Coluna 1: Logo e Slogan */}
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="text-xl font-bold flex items-center gap-2 mb-4">
                <Image 
                  src="logo-1.svg" 
                  alt="Logo Priowl" 
                  width={80} 
                  height={80} 
                  className="rounded"
                />
                <span className="tracking-tight text-[#8A6727]">Priowl</span>
              </Link>
              <p className="text-xs font-medium text-[#5E5E5E] leading-relaxed pr-4">
                A companheira luminosa para sua jornada diária de produtividade.
              </p>
            </div>
            
            {/* Coluna 2: Navegação */}
            <div className="col-span-1">
              <h4 className="font-bold mb-4 text-[10px] tracking-widest uppercase text-[#121212]">
                NAVEGAÇÃO
              </h4>
              <ul className="space-y-3 text-xs font-bold text-[#5E5E5E]">
                <li><Link href="#sobre" className="hover:text-[#121212] transition-colors">Sobre</Link></li>
                <li><Link href="#funcionalidades" className="hover:text-[#121212] transition-colors">Funcionalidades</Link></li>
                <li><Link href="/plans" className="hover:text-[#121212] transition-colors">Preços/Planos</Link></li>
                <li><Link href="#docs" className="hover:text-[#121212] transition-colors">Docs</Link></li>
              </ul>
            </div>

            {/* Coluna 3: Institucional */}
            <div className="col-span-1">
              <h4 className="font-bold mb-4 text-[10px] tracking-widest uppercase text-[#121212]">
                INSTITUCIONAL
              </h4>
              <ul className="space-y-3 text-xs font-bold text-[#5E5E5E]">
                <li><Link href="/suporte" className="hover:text-[#121212] transition-colors">Suporte/Contato</Link></li>
                <li><Link href="/termos" className="hover:text-[#121212] transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-[#121212] transition-colors">Privacidade</Link></li>
              </ul>
            </div>

            {/* Coluna 4: Direitos */}
            <div className="col-span-1 flex flex-col items-end text-right justify-between h-full">
              <div className="text-[10px] text-[#5E5E5E] font-medium leading-relaxed">
                Todos os direitos reservados para<br />
                Marcos Emanuel e Melkysedeke Costa
                <div className="text-2xl font-black text-[#EAEAEA] tracking-tighter mt-1">
                  2026
                </div>
              </div>
              <div className="flex gap-4 text-[9px] font-black tracking-widest uppercase text-[#5E5E5E] mt-4">
                <Link href="/contato" className="hover:text-[#121212] transition-colors">CONTATO</Link>
                <Link href="/suporte" className="hover:text-[#121212] transition-colors">SUPORTE</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}