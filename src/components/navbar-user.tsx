"use client";

import Logo from "@/components/logo";
import Link from "next/link";

const Navbar = ({ userImage }: { userImage: React.ReactNode }) => {
  return (
    <nav className="sticky backdrop-blur-md">
      <div className="flex text-white items-center justify-between p-8">
        <Logo />
        <Link href="/profile">
          <button>{userImage}</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
