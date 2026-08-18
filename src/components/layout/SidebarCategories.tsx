"use client";

import { useState } from "react";
import { Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button"; 
import CategoryModal from "@/components/modals/CategoryModal";
import CategoryItem from "@/components/item/CategoryItem"; // 🔹 Importe o novo componente
import { CategoryResponse } from "@/components/layout/Sidebar";
import { useRouter, useSearchParams } from "next/navigation";

interface SidebarCategoriesProps {
  categories: CategoryResponse[];
  onRefresh: () => void;
}

export default function SidebarCategories({ categories, onRefresh }: Readonly<SidebarCategoriesProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("categoria");

  // Controle dos modais
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // 🔹 Controle de Edição: Guarda qual categoria está sendo editada no momento
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryResponse | null>(null);

  const defaultCategories = categories.filter(c => c.userId === null);
  const customCategories = categories.filter(c => c.userId !== null);

  const handleSelectCategory = (categoryId: number) => {
    if (currentCategoryId === String(categoryId)) {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?categoria=${categoryId}`);
    }
  };

  const handleEditCategory = (category: CategoryResponse) => {
    setCategoryToEdit(category);
    // Aqui nós abrimos o Modal. Você precisará adaptar o seu CategoryModal para receber a `categoryToEdit` 
    // ou criar um EditCategoryModal separado. Para manter simples, podemos reutilizar o mesmo definindo o state.
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
                    currentCategoryId === String(category.id) ? "bg-muted/20" : "hover:bg-muted/10"
                  }`}
                >
                  <div className={`flex items-center gap-3 text-sm font-medium transition-colors ${
                    currentCategoryId === String(category.id) ? "text-foreground" : "text-muted group-hover:text-foreground"
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
                  isActive={currentCategoryId === String(category.id)}
                  onSelect={handleSelectCategory}
                  onRefresh={onRefresh}
                  onEdit={handleEditCategory} // 🔹 Passa a função de editar para o item
                />
              ))
            )}
          </ul>
        </div>

        {/* Botão Nova Categoria */}
        <div className="mt-6 mb-4">
            <Button 
            onClick={() => {
                setCategoryToEdit(null); // 🔹 Garante que vai abrir vazio para criar
                setIsCategoryModalOpen(true);
            }}
            className="flex w-full items-center justify-center gap-2 border-none bg-primary text-white font-medium transition-opacity hover:opacity-90"
            >
            <Plus size={16} />
            Nova Categoria
            </Button>
        </div>
        </div>

        {/* 🔹 ATUALIZE A CHAMADA DO MODAL AQUI */}
        <CategoryModal 
        isOpen={isCategoryModalOpen}
        initialData={categoryToEdit} // 👈 ESSA É A LINHA MÁGICA QUE FALTAVA
        onClose={() => {
            setIsCategoryModalOpen(false);
            setCategoryToEdit(null); // Limpa ao fechar
            onRefresh();
        }} 
        />
    </>
    );
}