"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation"; // 🔹 Importado o router do Next.js
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { atualizarPerfilAction, excluirContaAction, logoutAction } from "@/actions/user-actions";
import { ShieldCheck, RefreshCw, LogOut, KeyRound } from "lucide-react"; // 🔹 Adicionado ícone de chave
import { UserProfileResponse } from "@/types/user";

interface TabPerfilProps {
  user: UserProfileResponse | null; 
  fallback: string;
}

export function TabPerfil({ user, fallback }: Readonly<TabPerfilProps>) {
  const router = useRouter(); // 🔹 Inicializado o router
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<{ type: "success" | "error", msg: string } | null>(null);
  const [isPendingUpdate, startUpdate] = useTransition();
  const handleUpdateProfile = (formData: FormData) => {
    setUpdateFeedback(null);
    startUpdate(async () => {
      const result = await atualizarPerfilAction(formData);
      if (result?.error) {
        setUpdateFeedback({ type: "error", msg: result.error });
      } else if (result?.success) {
        setUpdateFeedback({ type: "success", msg: result.success });
      }
    });
  };
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("TEM CERTEZA? Esta ação é irreversível e todos os seus dados serão apagados.");
    if (!confirmed) return;

    setIsDeleting(true);
    await excluirContaAction();
    setIsDeleting(false); // Só roda se falhar, pois o sucesso faz redirect
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Cabeçalho do Perfil */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar 
              alt={`Foto de Perfil de ${user?.username || "Usuário"}`}
              fallbackInitials={fallback} 
              size="lg" 
              className="h-24 w-24 text-2xl" 
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {user?.username || "Usuário Não Identificado"}
            </h2>
            <p className="text-sm text-muted">Membro desde Outubro 2023 • São Paulo, Brasil</p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white">
                PREMIUM
              </span>
              <span className="rounded-full bg-background border border-border px-3 py-1 text-xs font-medium text-foreground">
                {user?.isAdmin === true ? "Administrador" : "Gestor de Projetos"}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Sair com lógica integrada */}
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex shrink-0 items-center gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {isLoggingOut ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Saindo...
            </>
          ) : (
            <>
              <LogOut size={18} />
              Sair da Conta
            </>
          )}
        </Button>
      </div>

      {/* Grid de Formulários */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Dados Pessoais (Agora Funcional) */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground">Dados Pessoais</h3>
          
          <form action={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nome de Usuário</label>
              <input 
                type="text" 
                name="username"
                defaultValue={user?.username || ""} 
                required
                className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
              <input 
                type="email" 
                name="email"
                defaultValue={user?.email || ""} 
                required
                className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            {/* Mensagem de Feedback do Form */}
            {updateFeedback && (
              <p className={`text-sm mt-2 ${updateFeedback.type === "success" ? "text-green-500" : "text-error"}`}>
                {updateFeedback.msg}
              </p>
            )}

            <Button 
              type="submit" 
              disabled={isPendingUpdate}
              className="mt-4 w-full bg-primary py-6 text-base font-medium text-white hover:bg-primary-hover disabled:opacity-70"
            >
              {isPendingUpdate ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </div>

        {/* Segurança */}
        <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground">Segurança</h3>
          
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-border border-dashed bg-background p-4">
            <ShieldCheck className="mt-0.5 text-primary" size={20} />
            <div>
              <p className="text-sm font-bold text-foreground">Autenticação de Dois Fatores</p>
              <p className="text-xs text-muted">Ativo via Google Authenticator</p>
            </div>
          </div>

          <div className="mt-auto border-t border-border pt-6">
            <h4 className="mb-1 font-bold text-foreground">Alterar Palavra-passe</h4>
            <p className="mb-4 text-sm text-muted">
              Você será redirecionado para uma tela segura onde poderá definir sua nova senha.
            </p>
            
            {/* 🔹 Botão refatorado para redirecionamento */}
            <Button 
              onClick={() => router.push("/change-password")} 
              className="flex w-full items-center justify-center gap-2 bg-foreground py-6 text-base font-medium text-background hover:opacity-90 transition-opacity"
            >
              <KeyRound size={18} />
              Alterar minha senha
            </Button>

          </div>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-error/30 bg-error/5 p-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-bold text-error">Encerrar Conta</h3>
          <p className="text-sm text-error/80">
            A exclusão da conta é permanente e removerá todos os seus dados e projetos.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="shrink-0 border-error/40 px-6 text-error hover:bg-error/10 hover:text-error"
        >
          {isDeleting ? "Excluindo..." : "Excluir Conta"}
        </Button>
      </div>

    </div>
  );
}