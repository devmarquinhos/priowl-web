"use client";

import { useState, useTransition } from "react";
import { Folder, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { CategoryResponse } from "@/components/layout/Sidebar";
import { deleteCategoriaAction } from "@/actions/category-actions";

interface CategoryItemProps {
  category: CategoryResponse;
  isActive: boolean;
  onSelect: (id: number) => void;
  onRefresh: () => void;
  onEdit: (category: CategoryResponse) => void; // Passa a categoria para o Modal de Edição
}

export default function CategoryItem({ 
  category, 
  isActive, 
  onSelect, 
  onRefresh, 
  onEdit 
}: Readonly<CategoryItemProps>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPendingDelete, startDelete] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique selecione a categoria
    setIsDropdownOpen(false);
    
    const confirm = window.confirm(`Tem certeza que deseja excluir a categoria "${category.title}"?`);
    if (!confirm) return;

    startDelete(async () => {
      const result = await deleteCategoriaAction(category.id);
      if (result.success) {
        onRefresh();
      } else {
        alert(result.error || "Erro ao excluir categoria.");
      }
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    onEdit(category);
  };

  return (
    <li 
      onClick={() => onSelect(category.id)}
      className={`relative flex cursor-pointer items-center justify-between group rounded-md p-2 transition-colors ${
        isActive ? "bg-muted/20" : "hover:bg-muted/10"
      }`}
    >
      <div className={`flex items-center gap-3 text-sm font-medium transition-colors ${
        isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
      }`}>
        <Folder 
          size={18} 
          className={category.color ? "" : "text-primary"} 
          style={category.color ? { color: category.color } : {}}
        />
        <span className="truncate max-w-[120px]">{category.title}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Botão de Opções (3 pontinhos) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          disabled={isPendingDelete}
          className={`transition-opacity text-muted hover:text-foreground ${
            isDropdownOpen || isPendingDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isPendingDelete ? <Loader2 size={16} className="animate-spin" /> : <MoreHorizontal size={16} />}
        </button>
        
        {/* Contagem de tarefas (some se o dropdown abrir para não poluir) */}
        {!isDropdownOpen && category.taskCount !== undefined && (
          <span className="text-xs font-semibold text-muted">
            {category.taskCount}
          </span>
        )}

        {/* Dropdown Menu (Tailwind Nativo) */}
        {isDropdownOpen && (
          <>
            {/* Overlay invisível para fechar o menu ao clicar fora */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
            />
            <div className="absolute right-8 top-8 z-50 w-36 rounded-md border border-border bg-card shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={handleEdit}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/30 transition-colors"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}