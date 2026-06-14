import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 ease-in-out bg-gray-100 hover:bg-gray-200 dark:bg-surface-dark dark:hover:bg-border-dark text-gray-600 dark:text-gray-300 shadow-inner"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 overflow-hidden flex items-center justify-center">
        <Sun
          className={`absolute transition-all duration-300 transform ${
            theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
          size={20}
        />
        <Moon
          className={`absolute transition-all duration-300 transform ${
            theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
          size={20}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
