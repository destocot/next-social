import type { User } from "@prisma/client";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { Advertisements } from "@/components/advertisements";
import { UserInfoCard } from "@/components/right-panel/user-info-card";
import { UserMediaCard } from "@/components/right-panel/user-media-card";
import { FriendRequests } from "@/components/right-panel/friend-requests";

type RightPanelProps = {
  profileUser?: User & {
    _count: { followers: number; following: number; posts: number };
  };
};

export const RightPanel = ({ profileUser }: RightPanelProps) => {
  return (
    <div className="flex flex-col gap-y-6">
      {profileUser?.userId && (
        <>
          <Suspense fallback="Loading">
            <UserInfoCard profileUser={profileUser} />
          </Suspense>

          <Suspense fallback="Loading">
            <UserMediaCard profileUser={profileUser} />
          </Suspense>
        </>
      )}
      <FriendRequests />
      <Birthdays />
      <Advertisements size="md" />
    </div>
  );
};

const Birthdays = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-sm flex flex-col gap-y-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Birthdays</span>
      </div>

      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-4">
          <Image
            src="https://picsum.photos/id/200/400/600"
            alt="user image"
            width="40"
            height="40"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold">Wayne Burton</span>
        </div>

        <div className="flex gap-x-3 justify-end">
          <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
            Celebrate
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-100 rounded-lg flex items-center gap-4">
        <Image src="/gift.png" alt="gift" width="24" height="24" />
        <Link href="/" className="flex flex-col gap-y-1 text-xs">
          <span className="text-gray-700 font-semibold">
            Upcoming Birthdays
          </span>
          <span className="text-gray-500">See 16 others with upcoming</span>
        </Link>
      </div>
    </div>
  );
};
