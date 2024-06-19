// components/ThemeToggle.tsx
"use client";
import {  useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence} from "framer-motion";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

const circleVariants = {
  inital:{
    scale:0
  },
  light: {
    scale: 1,
    transition: { duration: 0.5 , ease: "easeInOut" },
  },
  exit:{scale:0}
};



  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        className="p-2 bg-transparent group" 
      >
        <motion.svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
          className={"cursor-pointer"}
          onClick={toggleTheme}
        >
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            className={`fill-current text-blue-600 group-hover:text-blue-700 dark:text-yellow-200 dark:group-hover:text-amber-300`}
          />
          <motion.circle
            cx="24"
            cy="10"
            r="12"
            className={`fill-current text-white dark:text-gray-800`}
            initial="inital"
            animate={theme}
            exit="exit"
            variants={circleVariants}
          />
        </motion.svg>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeToggle;
