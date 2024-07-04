import { prisma } from "@/lib/db";
import { getUserFromClerkId } from "@/lib/server-utils";
import { generateFullName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const ProfileCard = async () => {
  const currUser = await getUserFromClerkId();

  const user = await prisma.user.findUniqueOrThrow({
    where: { userId: currUser.userId },
    include: { _count: { select: { followers: true } } },
  });

  const fullName = generateFullName(user);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-y-6">
      <div className="relative h-20">
        <Image
          src={user.cover ?? "/noCover.png"}
          alt="cover image"
          fill
          className="rounded-md"
        />
        <Image
          src={user.avatar ?? "/noAvatar.png"}
          alt="user image"
          width="48"
          height="48"
          className="rounded-full w-12 h-12 absolute left-0 right-0 m-auto object-cover -bottom-6 ring-1 ring-white z-10"
        />
      </div>

      <div className="h-20 flex flex-col gap-y-2 items-center">
        <span className="font-semibold">{fullName}</span>
        <div className="flex items-center gap-x-2">
          <div className="flex -space-x-1">
            <Image
              src="https://picsum.photos/id/307/400/600"
              alt="user image"
              width="16"
              height="16"
              className="rounded-full w-4 h-4 object-cover ring-1"
            />
            <Image
              src="https://picsum.photos/id/308/400/600"
              alt="user image"
              width="16"
              height="16"
              className="rounded-full w-4 h-4 object-cover ring-1"
            />
            <Image
              src="https://picsum.photos/id/309/400/600"
              alt="user image"
              width="16"
              height="16"
              className="rounded-full w-4 h-4 object-cover ring-1"
            />
          </div>
          <span className="text-xs text-gray-500">
            {user._count.followers} Followers
          </span>
        </div>

        <Link
          href={`/profile/${user.username}`}
          className="bg-blue-500 text-white text-sm p-2 rounded-md"
        >
          My Profile
        </Link>
      </div>
    </div>
  );
};
