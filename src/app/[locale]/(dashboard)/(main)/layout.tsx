import MainHeader from "@/components/layout/MainHeader";
import { getUserProfile } from "@/services/user";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserProfile();

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background text-foreground">
      <MainHeader user={user} />
      <main className="flex-1 overflow-y-auto bg-background p-8 transition-colors duration-200">
        {children}
      </main>
    </div>
  );
}