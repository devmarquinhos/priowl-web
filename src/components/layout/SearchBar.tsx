"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchBarProps {
  readonly placeholder?: string;
}

export default function SearchBar({ placeholder = "Pesquisar..." }: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [term, setTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (term === currentQ) return;

      const params = new URLSearchParams(searchParams.toString());
      
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [term, pathname, replace, searchParams]);

  return (
    <div className="group flex w-full items-center gap-2 rounded-md border border-transparent bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
      <Search size={18} className="shrink-0 text-muted transition-colors group-focus-within:text-primary" />
      <input
        type="text"
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full bg-transparent outline-none placeholder:text-muted"
      />
    </div>
  );
}