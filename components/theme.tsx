// components/theme.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const light = {
  bg: '#f3f4f6',
  text: '#111827',
  card: '#ffffff',
  muted: '#6b7280',
  primary: '#111827',
};

const dark = {
  bg: '#16181e',
  text: '#e2e8f0',
  card: '#111827',
  muted: '#94a3b8',
  primary: '#e2e8f0',
};

type Colors = typeof light;

type ThemeContextValue = {
  theme: Theme;
  colors: Colors;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  colors: light,
  toggle: () => {},
});

const STORAGE_KEY = '@theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Načtení uloženého theme při startu
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
          setTheme(stored);
        }
      } catch (err) {
        console.error('Failed to load theme', err);
      }
    })();
  }, []);

  // Ukládání při každé změně
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, theme).catch((err) =>
      console.error('Failed to save theme', err)
    );
  }, [theme]);

  const toggle = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  const colors = theme === 'dark' ? dark : light;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
