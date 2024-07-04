import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-between">
      {/* LEFT */}
      <div className="relative md:hidden lg:block w-1/5">
        <Link href="/" className="uppercase font-bold text-xl text-blue-600">
          Lamasocial
        </Link>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex md:items-center md:gap-x-4 w-3/5">
        {/* LINKS */}
        <div className="flex gap-x-6 text-gray-600 text-sm mr-4">
          <Link href="/" className="flex gap-x-2 items-center">
            <Image
              src="/home.png"
              alt="home"
              width="16"
              height="16"
              className="w-4 h-4"
            />
            Home
          </Link>

          <Link href="/" className="flex gap-x-2 items-center">
            <Image
              src="/friends.png"
              alt="friends"
              width="16"
              height="16"
              className="w-4 h-4"
            />
            Friends
          </Link>

          <Link href="/" className="flex gap-x-2 items-center">
            <Image
              src="/stories.png"
              alt="stories"
              width="16"
              height="16"
              className="w-4 h-4"
            />
            Stories
          </Link>
        </div>

        <div className="hidden xl:flex py-2 px-4 bg-slate-100 items-center rounded-xl justify-between">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none"
          />
          <Image src="/search.png" alt="search" width="14" height="14" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/5 flex items-center gap-x-4 xl:gap-x-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <div className="cursor-pointer">
              <Image src="/people.png" alt="people" width="20" height="20" />
            </div>
            <div className="cursor-pointer">
              <Image
                src="/messages.png"
                alt="messages"
                width="20"
                height="20"
              />
            </div>
            <div className="cursor-pointer">
              <Image
                src="/notifications.png"
                alt="notifications"
                width="20"
                height="20"
              />
            </div>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-x-2 text-sm">
              <Image src="/login.png" alt="login" width="20" height="20" />
              <Link href="/sign-in">Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>

        <MobileMenu />
      </div>
    </div>
  );
};
