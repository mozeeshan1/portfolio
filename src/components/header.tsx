// components/header.tsx
"use client";
import React, { useState,useEffect,useRef } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { motion,AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0); // State to store the header height
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Toggle body scroll based on menu state
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    // Set the scroll position to the top of the page
    window.scrollTo(0, 0);
  }, []);

  const headerVariants = {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
    exit: { opacity: 0, y: -100 },
  };

  const mobileNavbarVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const linkVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      ref={headerRef}
      variants={headerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed top-0 left-0 w-full shadow py-4 bg-white dark:bg-gray-800  transition-colors duration-500 z-30 text-gray-700 dark:text-gray-200"
    >
      <div className="relative container mx-auto flex justify-between items-center z-50">
        <div className="flex w-full justify-between items-center px-4">
          {/* Favicon/Home Link */}
          <div className="flex justify-center items-center gap-10">
            <Link href="/">
              <svg
                className="w-12 h-12"
                viewBox="0 0 385 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M147.25 25.376L89.65 69.664L32.05 25.376L0.0500002 0.799988V180H32.05V65.824L63.538 89.888L89.65 110.112L115.762 89.888L147.25 65.824V180H179.25V0.799988L147.25 25.376ZM270.336 147.744L294.4 116.768L314.624 90.656L359.168 32.8L384 0.799988H343.808H205.312V32.8H319.232L294.656 64.544L274.432 90.656L230.4 147.744L205.824 179.744L205.568 180H246.016L246.272 179.744H384.768V147.744H270.336Z"
                  className="fill-current"
                />
              </svg>
            </Link>
            <nav className={`hidden sm:flex sm:block`}>
              <ul className="flex pl-6 space-x-8">
                <motion.li variants={linkVariants}>
                  <Link href="/#top">Home</Link>
                </motion.li>
                <motion.li variants={linkVariants}>
                  <Link href="/#about-me">About</Link>
                </motion.li>
                <motion.li variants={linkVariants}>
                  <Link href="#contact">Contact</Link>
                </motion.li>
              </ul>
            </nav>
          </div>

          <button onClick={toggleMenu} className="sm:hidden">
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <div className={`hidden sm:flex sm:block`}>
          <ThemeToggle />
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={`flex flex-col items-center justify-around absolute w-full py-4 z-40 bg-white dark:bg-gray-800 transition-[background-color] duration-500 text-gray-700 dark:text-gray-200`}
            style={{
              top: `${headerHeight}px`,
              height: `calc(100vh - ${headerHeight}px)`,
            }}
            initial={{ opacity: 0, y: -100 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            exit={{
              opacity: 0,
              y: -100,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >
            <nav className="flex flex-col justify-center items-center pt-20 gap-10 ">
              <Link href="/#top" onClick={toggleMenu}>
                Home
              </Link>
              <Link href="/#about-me" onClick={toggleMenu}>
                About
              </Link>
              <Link href="#contact" onClick={toggleMenu}>
                Contact
              </Link>
            </nav>
            <ThemeToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
