import MainHeader from "@/components/layout/MainHeader";
import { getUserProfile } from "@/services/user";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Busca o usuário do cache/backend (não gera peso extra por conta da desduplicação)
  const user = await getUserProfile();

  return (
    <>
      <MainHeader user={user} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </>
  );
}