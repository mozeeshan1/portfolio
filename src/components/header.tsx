// components/header.tsx
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { motion } from "framer-motion";

const Header = () => {

  useEffect(() => {
    // Set the scroll position to the top of the page
    window.scrollTo(0, 0);
  }, []);

  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const linkVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="sticky top-0 left-0 w-full bg-white dark:bg-gray-800 shadow py-4 transition-colors duration-500 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            {/* Animate each link */}
            <motion.li variants={linkVariants}>
              <Link href="/" className="text-gray-800 dark:text-white">
                Home
              </Link>
            </motion.li>
            <motion.li variants={linkVariants}>
              <Link href="/about" className="text-gray-800 dark:text-white">
                About
              </Link>
            </motion.li>
            <motion.li variants={linkVariants}>
              <Link href="/contact" className="text-gray-800 dark:text-white">
                Contact
              </Link>
            </motion.li>
            {/* Add more links as needed */}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </motion.header>
  );
};

export default Header;
