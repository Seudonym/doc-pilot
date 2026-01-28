"use client";

import Logo from "@/components/logo";
import { CogIcon } from "lucide-react";
import { motion } from "motion/react";
import ContextMenuButton from "./context-menu-button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/register");
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

  const menuItems = [
    { label: "Profile", href: "/profile" },
    { label: "Settings" },
    {
      label: isSigningOut ? "Signing out..." : "Sign Out",
      onClick: handleSignOut,
      variant: "danger" as const,
    },
  ];

  return (
    <nav className="sticky z-20 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 0.6 }}
        className="flex text-white items-center justify-between p-8"
      >
        <Logo />
        <ContextMenuButton
          icon={
            <CogIcon className="w-6 h-6 hover:rotate-180 ease-in-out transition-transform" />
          }
          items={menuItems}
        />
      </motion.div>
    </nav>
  );
};

export default Navbar;
