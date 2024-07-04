import { generateFullName } from "@/lib/utils";
import type { User } from "@prisma/client";
import Image from "next/image";

type UserProfileHeaderProps = {
  profileUser: User & {
    _count: { followers: number; following: number; posts: number };
  };
};

export const UserProfileHeader = ({ profileUser }: UserProfileHeaderProps) => {
  const fullName = generateFullName(profileUser);

  return (
    <div className="flex flex-col items-center justify-center shadow rounded-lg">
      <div className="w-full h-64 relative">
        <Image
          src={profileUser.cover ?? "noCover.png"}
          alt="cover image"
          fill
          className="rounded-t-md object-cover"
        />
        <Image
          src={profileUser.avatar ?? "noAvatar.png"}
          alt="user image"
          width="128"
          height="128"
          className="object-cover w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white"
        />
      </div>

      <h1 className="mt-20 mb-4 text-2xl font-medium">{fullName}</h1>

      <div className="flex items-center justify-center gap-12 mb-4">
        <div className="flex flex-col items-center">
          <span className="font-medium">{profileUser._count.posts}</span>
          <span className="text-sm">Posts</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-medium">{profileUser._count.followers}</span>
          <span className="text-sm">Followers</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-medium">{profileUser._count.following}</span>
          <span className="text-sm">Following</span>
        </div>
      </div>
    </div>
  );
};
