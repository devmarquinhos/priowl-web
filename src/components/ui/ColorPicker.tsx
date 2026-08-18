"use client";

import { useId } from "react";

interface ColorPickerProps {
  readonly colors: readonly string[]; 
  readonly selectedColor: string;
  readonly onChange: (color: string) => void;
}

export function ColorPicker({ colors, selectedColor, onChange }: Readonly<ColorPickerProps>) {
  const reactId = useId();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {colors.map((color, index) => {
        const inputId = `${reactId}-color-${index}`;
        const isSelected = selectedColor === color;

        return (
          <div key={color} className="relative flex">
            <input
              type="radio"
              id={inputId}
              name={`color-picker-${reactId}`}
              value={color}
              checked={isSelected}
              onChange={() => onChange(color)}
              className="peer sr-only" 
            />
            <label
              htmlFor={inputId}
              // 🔹 Correção: Adicionado `ring-offset-card` e `peer-focus-visible:ring-offset-card`
              className={`block w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card peer-focus-visible:ring-primary ${
                isSelected 
                  ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110" 
                  : "border border-border shadow-sm"
              }`}
              style={{ backgroundColor: color }}
            >
              <span className="sr-only">Selecionar cor {color}</span>
            </label>
          </div>
        );
      })}

      {/* Botão de + para seletor customizado */}
      <div className="relative flex">
        <input
          type="color"
          id={`${reactId}-custom`}
          className="peer sr-only"
          value={selectedColor.startsWith('#') && selectedColor.length === 7 ? selectedColor : '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
        <label
          htmlFor={`${reactId}-custom`}
          className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer bg-background text-muted border border-border shadow-sm transition-transform hover:scale-110 hover:bg-card peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card peer-focus-visible:ring-primary"
          title="Escolher cor personalizada"
        >
          <span className="text-xl font-light leading-none mb-0.5">+</span>
        </label>
      </div>
    </div>
  );
}