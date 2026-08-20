import SettingsHeader from "@/components/layout/SettingsHeader";
import { getUserProfile } from "@/services/user";

export default async function ConfigLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUserProfile();

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background text-foreground">
      <SettingsHeader user={user} />
      <main className="flex-1 overflow-y-auto bg-background p-8 transition-colors duration-200">
        {children} {/* Renderiza a tela de Perfil/Configurações aqui */}
      </main>
    </div>
  );
}