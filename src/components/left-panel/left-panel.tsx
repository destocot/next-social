import Link from "next/link";
import { ProfileCard } from "./profile-card";
import Image from "next/image";
import { Advertisements } from "@/components/advertisements";

type LeftPanelProps = {
  type: "home" | "profile";
};

export const LeftPanel = ({ type }: LeftPanelProps) => {
  return (
    <div className="flex flex-col gap-y-6">
      {type === "home" && <ProfileCard />}
      <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-y-2">
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/posts.png" alt="" width="20" height="20" />
          My Posts
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/activity.png" alt="" width="20" height="20" />
          Activity
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/market.png" alt="" width="20" height="20" />
          Marketplace
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/events.png" alt="" width="20" height="20" />
          Events
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/albums.png" alt="" width="20" height="20" />
          Albums
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/videos.png" alt="" width="20" height="20" />
          Videos
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/news.png" alt="" width="20" height="20" />
          News
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/courses.png" alt="" width="20" height="20" />
          Courseses
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/lists.png" alt="" width="20" height="20" />
          Lists
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="#"
          className="flex items-center gap-x-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/settings.png" alt="" width="20" height="20" />
          Settings
        </Link>
      </div>

      <Advertisements size="sm" />
    </div>
  );
};
