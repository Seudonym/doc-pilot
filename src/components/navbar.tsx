"use client";
import { MenuIcon, SendIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Overview");
  const navItems = [
    { label: "Overview", href: "#overview" },
    { label: "Features", href: "#features" },
    { label: "Try Now", href: "#try" },
  ];

  return (
    <nav className="sticky backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 0.6, delay: 0.8 }}
        className="flex text-white items-center justify-between p-8"
      >
        <div className="flex gap-2 items-center">
          <SendIcon className="stroke-2 w-4 h-4 md:w-6 md:h-6 text-purple-400" />
          <span className="font-sans font-bold text-xl md:text-3xl tracking-tighter">
            DocPilot
          </span>
        </div>

        <ul className="hidden md:flex gap-12 items-center">
          {navItems.map((item) => (
            <li key={item.label} className="font-medium text-lg ">
              <a
                className={twMerge(
                  "hover:text-shadow-[0_0_10px_#fff]",
                  active === item.label && "text-shadow-[0_0_10px_#fff]",
                )}
                onClick={() => setActive(item.label)}
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/*mobile shit*/}
        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </motion.div>

      {/*mobile shit*/}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="md:hidden overflow-hidden text-white "
          >
            <ul className="flex flex-col items-center gap-4 px-6 pb-6 pt-4">
              {navItems.map((item) => (
                <li key={item.label} className="font-medium">
                  <a
                    href={item.href}
                    onClick={() => {
                      setMenuOpen(false);
                      setActive(item.label);
                    }}
                    className={twMerge(
                      "block",
                      active === item.label && "text-shadow-[0_0_10px_#fff]",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
