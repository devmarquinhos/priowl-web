"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import { createContext, useContext, useState, useMemo } from "react";

// Adicionamos a propriedade initialColorHex
interface ThemeProviderProps extends Omit<NextThemesProviderProps, "children"> {
  readonly children: React.ReactNode;
  readonly initialColorHex?: string; 
}

interface ColorContextType {
  primaryColor: string;
  changePrimaryColor: (color: string) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  initialColorHex = "#D6A628",
  ...props 
}: Readonly<ThemeProviderProps>) {
  
  const [primaryColor, setPrimaryColor] = useState(initialColorHex);

  const changePrimaryColor = (color: string) => {
    setPrimaryColor(color);
    document.documentElement.style.setProperty("--color-primary", color);
  };

  const colorContextValue = useMemo(
    () => ({
      primaryColor,
      changePrimaryColor,
    }),
    [primaryColor]
  );

  return (
    <ColorContext.Provider value={colorContextValue}>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
        {...props}
      >
        {children}
      </NextThemesProvider>
    </ColorContext.Provider>
  );
}

export function usePrimaryColor() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("usePrimaryColor deve ser usado dentro de um ThemeProvider");
  }
  return context;
}