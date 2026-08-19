"use client";

import { useState, useTransition } from "react";
import { Folder, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import type { CategoryResponse } from "@/components/layout/Sidebar";
import { deleteCategoriaAction } from "@/actions/category-actions";

interface CategoryItemProps {
  readonly category: CategoryResponse;
  readonly isActive: boolean;
  readonly onSelect: (id: number) => void;
  readonly onRefresh: () => void;
  readonly onEdit: (category: CategoryResponse) => void;
}

export default function CategoryItem({ 
  category, 
  isActive, 
  onSelect, 
  onRefresh, 
  onEdit 
}: CategoryItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPendingDelete, startDelete] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // 🔹 Garante que mostramos 0 caso o backend não envie a propriedade
  const taskCount = category.taskCount ?? 0;

  return (
    <li 
      onClick={() => onSelect(category.id)}
      className={`relative flex cursor-pointer items-center justify-between group rounded-md p-2 transition-colors ${
        isActive ? "bg-muted/30" : "hover:bg-muted/10"
      }`}
    >
      <div className={`flex items-center gap-3 text-sm font-medium transition-colors ${
        isActive ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
      }`}>
        <Folder 
          size={16} 
          className={category.color ? "" : (isActive ? "text-primary" : "text-muted-foreground")} 
          style={category.color ? { color: category.color, fill: isActive ? `${category.color}33` : 'transparent' } : {}}
        />
        <span className="truncate max-w-[120px]">{category.title}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Botão de Opções */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          disabled={isPendingDelete}
          className={`transition-opacity p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 ${
            isDropdownOpen || isPendingDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isPendingDelete ? <Loader2 size={14} className="animate-spin" /> : <MoreHorizontal size={14} />}
        </button>
        
        {/* 🔹 Contagem de tarefas fixada à direita (Oculta se o menu abrir) */}
        {!isDropdownOpen && (
          <span className={`text-[11px] font-bold w-4 text-right transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
            {taskCount}
          </span>
        )}

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
            />
            <div className="absolute right-8 top-8 z-50 w-36 rounded-md border border-border bg-card shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={handleEdit}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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