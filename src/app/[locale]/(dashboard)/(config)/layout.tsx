import SettingsHeader from "@/components/layout/SettingsHeader";
import { getUserProfile } from "@/services/user";

export default async function ConfigLayout({ children }: { children: React.ReactNode }) {
  // Busca o usuário do cache/backend (o Next.js otimiza para não duplicar requisições!)
  const user = await getUserProfile();

  return (
    <>
      <SettingsHeader user={user} />
      <main className="flex-1 overflow-y-auto p-8">
        {children} {/* Renderiza a tela de Perfil/Configurações aqui */}
      </main>
    </>
  );
}