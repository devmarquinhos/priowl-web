"use client";

import React, { useState, useEffect } from 'react';
import { ColorPicker } from "@/components/ui/ColorPicker"; 
import { Button } from "@/components/ui/Button";
import { createCategoriaAction, updateCategoriaAction } from "@/actions/category-actions"; 
import { AlertCircle } from "lucide-react";
import { CategoryResponse } from "@/components/layout/Sidebar"; 

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryResponse | null; 
}

const categoryColors = [
  '#D6A628', '#5F6368', '#4B5B4D', '#9C4B2E', '#2C2D30'
] as const;

const CategoryModal = ({ isOpen, onClose, initialData }: CategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>('#D6A628'); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = !!initialData; 

  useEffect(() => {
    if (isOpen && initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryName(initialData.title);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedColor(initialData.color || '#D6A628');
    } else if (isOpen && !initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryName("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedColor('#D6A628');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrorMessage(""); 
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setErrorMessage("");

    if (!categoryName.trim()) {
      setErrorMessage("O nome da categoria é obrigatório.");
      return;
    }

    setIsLoading(true);

    let result;

    if (isEditing) {
      result = await updateCategoriaAction(initialData.id, categoryName, selectedColor);
    } else {
      result = await createCategoriaAction(categoryName, selectedColor);
    }

    if (result.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      onClose(); 
    }
  };

  // 🔹 Solução para o SonarLint: Função para extrair o ternário aninhado
  const getSubmitButtonText = () => {
    if (isLoading) return "Salvando...";
    if (isEditing) return "Atualizar Categoria";
    return "Salvar Categoria";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[420px] bg-card border border-primary/40 rounded-xl shadow-2xl overflow-hidden">
        
        <div className="px-6 py-5 border-b border-primary/20">
          <h2 className="text-[20px] font-bold text-foreground tracking-tight">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </h2>
        </div>

        <div className="p-6 space-y-6 bg-card">
          
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-[13px] text-red-600 border border-red-100">
              <AlertCircle size={16} className="shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="categoryName" className="block text-[11px] font-bold text-muted uppercase tracking-wider">
              Nome da Categoria
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ex: Financeiro, Trabalho..."
              className="w-full px-3 py-2.5 text-[13px] bg-background border border-primary/30 rounded-md text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-3">
            <span className="block text-[11px] font-bold text-muted uppercase tracking-wider">
              Cor da Categoria
            </span>
            <ColorPicker
              colors={categoryColors}
              selectedColor={selectedColor}
              onChange={setSelectedColor}
            />
          </div>

        </div>

        <div className="px-6 py-4 flex items-center justify-end gap-3 bg-background/50 border-t border-primary/20">
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-[13px] font-bold !text-muted hover:!text-foreground bg-transparent border-none hover:bg-transparent shadow-none transition-colors disabled:opacity-50"
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2.5 text-[13px] font-bold text-white bg-primary hover:bg-primary-hover rounded-md shadow-sm transition-colors border-none disabled:opacity-70"
          >
            {/* 🔹 Renderiza o texto do botão limpo */}
            {getSubmitButtonText()}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default CategoryModal;