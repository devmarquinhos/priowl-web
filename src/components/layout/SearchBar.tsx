import { Search } from "lucide-react";

interface SearchBarProps {
  readonly placeholder?: string;
}

export default function SearchBar({ placeholder = "Pesquisar..." }: SearchBarProps) {
  return (

    <div className="group flex w-full items-center gap-2 rounded-md border border-transparent bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
      
      <Search size={18} className="shrink-0 text-muted transition-colors group-focus-within:text-primary" />
      
      <input
        type="text"
        placeholder={placeholder}

        className="w-full bg-transparent outline-none placeholder:text-muted"
      />
    </div>
  );
}