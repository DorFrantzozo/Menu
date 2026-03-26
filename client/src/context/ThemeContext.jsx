import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Read from localStorage with the specific key 'admin-theme'
    const savedTheme = localStorage.getItem('admin-theme');
    return savedTheme === 'dark'; // default to light if not set
  });

  const location = useLocation();

  // Define public menu paths that should NOT be in dark mode.
  // We check if the pathname starts with any of these.
  const publicMenuPaths = [
    '/menu', '/design1', '/design2', '/design3', '/design4', '/design5', '/design4DishDetails'
  ];

  const isPublicMenu = publicMenuPaths.some(path => location.pathname.startsWith(path)) || 
                       (window.location.hostname !== 'localhost' && 
                        window.location.hostname !== 'menuyou.online' && 
                        window.location.hostname !== 'www.menuyou.online');

  // Also Landing2 (path === '/') should not be dark
  const isLandingPage = location.pathname === '/';

  const shouldApplyDark = isDarkMode && !isPublicMenu && !isLandingPage;

  useEffect(() => {
    const root = document.documentElement;

    if (shouldApplyDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

  }, [shouldApplyDark, location.pathname]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('admin-theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
