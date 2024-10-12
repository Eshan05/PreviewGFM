import { useState, useEffect } from 'react';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true'; // Parse the string to a boolean
  });

  useEffect(() => {
    // Apply the theme class based on the current state
    document.body.classList.toggle('dark', darkMode);
    // Save the theme preference to local storage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <button
      id="theme-toggle"
      onClick={toggleDarkMode}
      className="flex items-center p-2 transition-colors duration-300 rounded-full text-[1em] bg-neutral-300 w-fit dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? <IoSunnyOutline className='text-white' /> : <IoMoonOutline />}
    </button>
  );
};

export default ThemeToggle;
