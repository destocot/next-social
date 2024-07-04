"use client";

import Link from "next/link";
import { useState } from "react";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => void setIsOpen((prev) => !prev);

  return (
    <div className="md:hidden">
      <div className="flex flex-col gap-y-1 cursor-pointer" onClick={onClick}>
        <div
          data-open={isOpen}
          className="w-6 h-1 bg-blue-500 rounded-sm origin-left ease-in-out duration-500 data-[open=true]:rotate-45"
        />
        <div
          data-open={isOpen}
          className="w-6 h-1 bg-blue-500 rounded-sm data-[open=true]:opacity-0"
        />
        <div
          data-open={isOpen}
          className="w-6 h-1 bg-blue-500 rounded-sm origin-left ease-in-out duration-500 data-[open=true]:-rotate-45"
        />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-24 w-full h-[calc(100vh-6rem)] bg-white flex flex-col items-center justify-center gap-y-8 font-medium text-xl z-30">
          <Link href="/">Home</Link>
          <Link href="/">Friends</Link>
          <Link href="/">Groups</Link>
          <Link href="/">Stories</Link>
          <Link href="/">Login</Link>
        </div>
      )}
    </div>
  );
};
