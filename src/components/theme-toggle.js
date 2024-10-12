import { useState } from 'react';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode);
  };

  return (
    <button
      id="theme-toggle"
      onClick={toggleDarkMode}
      className="flex items-center p-2 transition-colors duration-300 rounded-full text-[1em] bg-neutral-300 w-fit dark:bg-neutral-700"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (<IoSunnyOutline className='text-white' />) : (<IoMoonOutline />)}
    </button>
  );
};

export default ThemeToggle;
