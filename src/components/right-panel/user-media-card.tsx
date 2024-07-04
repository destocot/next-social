import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type UserMediaCardProps = {
  profileUser: User & {
    _count: { followers: number; following: number; posts: number };
  };
};

export const UserMediaCard = async ({ profileUser }: UserMediaCardProps) => {
  const postsWithMedia = await prisma.post.findMany({
    where: { userId: profileUser.userId, image: { not: null } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>

      <div className="flex gap-4 justify-start flex-wrap">
        {postsWithMedia.length > 0 ? (
          postsWithMedia.map((post) => (
            <div key={post.postId} className="relative w-1/5 h-24">
              <Image
                src={post.image!}
                alt="post image"
                fill
                className="object-cover rounded-md"
              />
            </div>
          ))
        ) : (
          <p>No media found!</p>
        )}
      </div>
    </div>
  );
};
