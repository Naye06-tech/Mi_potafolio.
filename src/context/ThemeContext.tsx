import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Theme } from "../types";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme') as Theme | null; 
        return saved || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (): void => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

