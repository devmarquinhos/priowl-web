import Image from "next/image";
import Link from "next/link"; // 1. Importando o Link do Next.js

interface AvatarProps {
  readonly src?: string;
  readonly alt: string;
  readonly fallbackInitials: string;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
  readonly href?: string; // 2. Nova propriedade opcional para o redirecionamento
}

export function Avatar({ src, alt, fallbackInitials, size = "md", className = "", href }: Readonly<AvatarProps>) {
  const sizeClasses = {
    // 3. Adicionado tamanhos de borda proporcionais
    sm: "w-8 h-8 text-xs border-[1.5px]",
    md: "w-10 h-10 text-sm border-2",
    lg: "w-16 h-16 text-lg border-[3px]",
  };

  // 4. Adicionado border-primary para puxar a cor do tema
  const baseClasses = "relative flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-primary border-primary";

  // O conteúdo do Avatar (Imagem ou Iniciais)
  const avatarContent = (
    <div className={`${baseClasses} ${sizeClasses[size]} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <span>{fallbackInitials.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  );

  // 5. Se foi passado um link (href), envelopamos o Avatar no componente Link
  if (href) {
    return (
      <Link 
        href={href} 
        className="inline-block rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        title="Ir para o perfil"
      >
        {avatarContent}
      </Link>
    );
  }

  // Se não tem link, retorna apenas o Avatar normal
  return avatarContent;
}