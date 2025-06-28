import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  'dark-blue': {
    name: 'Dark Blue',
    class: 'theme-dark-blue',
    icon: '🌊'
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark-blue');

  useEffect(() => {
    // Always use dark blue theme
    const root = document.documentElement;
    root.classList.add('theme-dark-blue');
  }, []);

  const switchTheme = (themeKey) => {
    // Only allow dark-blue theme
    if (themeKey === 'dark-blue') {
      setCurrentTheme(themeKey);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themes,
      switchTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};