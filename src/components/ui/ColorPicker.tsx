import { useId } from "react";

interface ColorPickerProps {
  readonly colors: readonly string[]; 
  readonly selectedColor: string;
  readonly onChange: (color: string) => void;
  readonly label?: string;
}

export function ColorPicker({ colors, selectedColor, onChange, label }: Readonly<ColorPickerProps>) {
  const reactId = useId();

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2 border border-border p-2 rounded">
        {colors.map((color, index) => {
          const inputId = `${reactId}-color-${index}`;
          const isSelected = selectedColor === color;

          return (
            <div key={color} className="relative">
              <input
                type="radio"
                id={inputId}
                name={`color-picker-${reactId}`}
                value={color}
                checked={isSelected}
                onChange={() => onChange(color)}
                className="sr-only" 
              />
              <label
                htmlFor={inputId}
                className={`block w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                  isSelected ? "ring-2 ring-offset-2 ring-primary dark:ring-offset-[var(--background)] scale-110" : ""
                }`}
                style={{ backgroundColor: color }}
              >
                <span className="sr-only">Selecionar cor {color}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}