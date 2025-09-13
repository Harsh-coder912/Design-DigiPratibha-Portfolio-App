import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    try {
      const savedTheme = localStorage.getItem('digipratibha_theme') as 'light' | 'dark';
      if (savedTheme && isMounted) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Theme init error:', error);
    } finally {
      if (isMounted) {
        setMounted(true);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    try {
      document.documentElement.className = theme;
      localStorage.setItem('digipratibha_theme', theme);
    } catch (error) {
      console.error('Theme update error:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}