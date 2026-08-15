import { Search } from "lucide-react";

interface SearchBarProps {
  readonly placeholder?: string;
}

export default function SearchBar({ placeholder = "Pesquisar..." }: SearchBarProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-md bg-[#F4F4F5] px-4 py-2.5 text-sm text-gray-700 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8A6D3B]/20 focus-within:border focus-within:border-[#8A6D3B]">
      <Search size={18} className="text-gray-400 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-gray-400"
      />
    </div>
  );
}