import React from "react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between px-2 py-6 md:px-16 ${
        darkMode
          ? "bg-gray-900 text-white border-b-2"
          : "bg-white text-gray-900"
      } shadow-md`}
    >
      <h1 className="text-xl font-bold">Task Manager</h1>
      <button
        onClick={toggleDarkMode}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
          darkMode
            ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default Header;
