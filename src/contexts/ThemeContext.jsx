import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  'dark-blue': {
    name: 'Dark Blue',
    class: 'theme-dark-blue',
    icon: '🌊'
  },
  'gaming-red': {
    name: 'Gaming Red',
    class: 'theme-gaming-red',
    icon: '🎮'
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('securechat-theme');
    return saved || 'dark-blue';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(themes).forEach(theme => {
      root.classList.remove(theme.class);
    });
    
    // Add current theme class
    root.classList.add(themes[currentTheme].class);
    
    // Save to localStorage
    localStorage.setItem('securechat-theme', currentTheme);
  }, [currentTheme]);

  const switchTheme = (themeKey) => {
    if (themes[themeKey]) {
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