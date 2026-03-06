import { useEffect } from 'react';
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
    // Initial state from localStorage or system preference
    const getInitialTheme = (): Theme => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    return {
        theme: getInitialTheme(),
        toggleTheme: () => set((state) => {
            const nextTheme = state.theme === 'light' ? 'dark' : 'light';
            
            // Side effect: update DOM and localStorage immediately
            document.documentElement.classList.remove('light', 'dark', 'yellow');
            document.documentElement.classList.add(nextTheme);
            localStorage.setItem('theme', nextTheme);

            return { theme: nextTheme };
        })
    };
});

// Hook for compatibility and initialization
export function useTheme() {
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        // Ensure class is applied on mount
        document.documentElement.classList.remove('light', 'dark', 'yellow');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return {
        theme,
        toggleTheme,
        isDark: theme === 'dark'
    };
} 