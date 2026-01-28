"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

interface MenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "default" | "danger";
}

interface ContextMenuButtonProps {
  icon: ReactNode;
  items: MenuItem[];
}

const ContextMenuButton = ({ icon, items }: ContextMenuButtonProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setOpen(false);
  };

  return (
    <div className="z-10 flex items-center relative" ref={menuRef}>
      <button onClick={() => setOpen((prev) => !prev)}>{icon}</button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="context-menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute w-48 top-16 right-0 bg-zinc-800 border border-white/10 rounded-lg p-2 shadow-lg"
          >
            {items.map((item, index) =>
              item.href ? (
                <Link key={index} href={item.href}>
                  <button
                    onClick={() =>
                      item.onClick
                        ? handleItemClick(item.onClick)
                        : setOpen(false)
                    }
                    className={
                      item.className ||
                      `px-4 py-2 hover:bg-zinc-700 w-full text-left rounded ${
                        item.variant === "danger" ? "text-red-400" : ""
                      }`
                    }
                  >
                    {item.label}
                  </button>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() =>
                    item.onClick
                      ? handleItemClick(item.onClick)
                      : setOpen(false)
                  }
                  className={
                    item.className ||
                    `px-4 py-2 hover:bg-zinc-700 w-full text-left rounded ${
                      item.variant === "danger" ? "text-red-400" : ""
                    }`
                  }
                >
                  {item.label}
                </button>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextMenuButton;
