"use client";

import { useState } from "react";
import { Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button"; 
import CategoryModal from "@/components/modals/CategoryModal";
import CategoryItem from "@/components/item/CategoryItem";
import type { CategoryResponse } from "@/components/layout/Sidebar";
import { useRouter, useSearchParams } from "next/navigation";

interface SidebarCategoriesProps {
  readonly categories: CategoryResponse[];
  readonly onRefresh: () => void;
}

export default function SidebarCategories({ categories, onRefresh }: SidebarCategoriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Lê o parâmetro em inglês ("category") da URL
  const activeCategoryId = searchParams.get("category");

  // Controle dos modais de criação/edição
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(null);

  const defaultCategories = categories.filter((c) => c.userId === null);
  const customCategories = categories.filter((c) => c.userId !== null);

  const handleSelectCategory = (categoryId: number) => {
    if (activeCategoryId === String(categoryId)) {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?category=${categoryId}`);
    }
  };

  const handleEditCategory = (category: CategoryResponse) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true); 
  };

  return (
    <>
      <div className="flex flex-1 flex-col px-6 overflow-y-auto">
        
        {/* BLOCO 1: Categorias Padrão */}
        {defaultCategories.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-xs font-bold tracking-widest text-muted">
              CATEGORIAS PADRÃO
            </h3>
            <ul className="flex flex-col gap-1">
              {defaultCategories.map((category) => (
                <li 
                  key={category.id} 
                  onClick={() => handleSelectCategory(category.id)}
                  className={`flex cursor-pointer items-center justify-between group rounded-md p-2 transition-colors ${
                    activeCategoryId === String(category.id) ? "bg-muted/20" : "hover:bg-muted/10"
                  }`}
                >
                  <div className={`flex items-center gap-3 text-sm font-medium transition-colors ${
                    activeCategoryId === String(category.id) ? "text-foreground" : "text-muted group-hover:text-foreground"
                  }`}>
                    <Globe 
                      size={18} 
                      className={category.color ? "" : "text-primary/70"} 
                      style={category.color ? { color: category.color } : {}}
                    />
                    {category.title}
                  </div>
                  {category.taskCount !== undefined && (
                    <span className="text-xs font-semibold text-muted">
                      {category.taskCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* BLOCO 2: Minhas Categorias */}
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-widest text-muted">
            MINHAS CATEGORIAS
          </h3>
          <ul className="flex flex-col gap-1">
            {customCategories.length === 0 ? (
              <span className="text-xs text-muted px-2">Nenhuma categoria criada.</span>
            ) : (
              customCategories.map((category) => (
                <CategoryItem 
                  key={category.id}
                  category={category}
                  isActive={activeCategoryId === String(category.id)}
                  onSelect={handleSelectCategory}
                  onRefresh={onRefresh}
                  onEdit={handleEditCategory}
                />
              ))
            )}
          </ul>
        </div>

        {/* Botão Nova Categoria */}
        <div className="mt-6 mb-4">
          <Button 
            onClick={() => {
              setCategoryToEdit(null);
              setIsCategoryModalOpen(true);
            }}
            className="flex w-full items-center justify-center gap-2 border-none bg-primary text-white font-medium transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Modal para Criação/Edição */}
      <CategoryModal 
        isOpen={isCategoryModalOpen}
        initialData={categoryToEdit}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setCategoryToEdit(null);
          onRefresh();
        }} 
      />
    </>
  );
}