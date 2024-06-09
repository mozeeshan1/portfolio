// components/ThemeToggle.tsx
"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const buttonVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    setMounted(true);
    console.log("Theme initialized to: ", theme);
  }, []);

  useEffect(() => {
    console.log("Theme changed to: ", theme);
  }, [theme]); // This useEffect will run when 'theme' changes

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    console.log("Theme set to: ", newTheme); // Log the new theme value
  };

  // Determine button label based on the theme
  const getButtonLabel = () => {
    if (!mounted) {
      // Render a transparent placeholder
      return <span style={{ opacity: 0 }}>Placeholder</span>;
    }
    return theme === "dark"
      ? "Switch to Light Mode"
      : "Switch to Dark Mode";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.button
        key={theme}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={buttonVariants}
        transition={{ duration: 0.3 }}
        className="p-2 bg-gray-200 dark:bg-gray-600 rounded shadow-md hover:bg-gray-300 dark:hover:bg-gray-500 text-black dark:text-white"
        onClick={toggleTheme}
      >
        {getButtonLabel()}
      </motion.button>
    </AnimatePresence>
  );
};

export default ThemeToggle;