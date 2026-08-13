import Image from "next/image";

interface AvatarProps {
  readonly src?: string;
  readonly alt: string;
  readonly fallbackInitials: string;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
}

export function Avatar({ src, alt, fallbackInitials, size = "md", className = "" }: Readonly<AvatarProps>) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  const baseClasses = "relative flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-primary";

  return (
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
}