import { User } from "@prisma/client";
import { FeedPost } from "./feed-post";
import { getUserFromClerkId } from "@/lib/server-utils";
import { prisma } from "@/lib/db";

type FeedProps = {
  username?: User["username"];
};

export const Feed = async ({ username }: FeedProps) => {
  const currentUser = await getUserFromClerkId();

  let posts;

  if (username) {
    posts = await prisma.post.findMany({
      where: { user: { username } },
      include: {
        user: true,
        likes: {
          select: {
            user: {
              select: {
                clerkId: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    const following = await prisma.follow.findMany({
      where: { followerUserId: currentUser.userId },
      select: { followingUserId: true },
    });

    const followingUserIds = following.map((f) => f.followingUserId);
    followingUserIds.push(currentUser.userId);

    posts = await prisma.post.findMany({
      where: { userId: { in: followingUserIds } },
      include: {
        user: true,
        likes: {
          select: {
            user: {
              select: {
                clerkId: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-y-12">
      {posts.map((post) => (
        <FeedPost key={post.postId} post={post} />
      ))}
    </div>
  );
};
