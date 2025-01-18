import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
  } from "react";
  
  interface DarkModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
  }
  
  const DarkModeContext = createContext<DarkModeContextType | undefined>(
    undefined
  );
  
  export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
      // Retrieve the saved theme preference from localStorage or default to light mode
      return JSON.parse(localStorage.getItem("darkMode") || "false");
    });
  
    const toggleDarkMode = () => {
      setDarkMode((prevMode) => {
        const newMode = !prevMode;
        localStorage.setItem("darkMode", JSON.stringify(newMode));
        document.documentElement.classList.toggle("dark", newMode);
        return newMode;
      });
    };
  
    useEffect(() => {
      // To ensure the correct class is applied on initial load
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [darkMode]);
  
    return (
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        {children}
      </DarkModeContext.Provider>
    );
  };
  
  export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
      throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
  };
  