import { generateFullName } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { PostInteraction } from "@/components/center-panel/post-interaction";
import { Comments } from "@/components/center-panel/comments";
import { Suspense } from "react";
import { PostInfo } from "@/components/center-panel/post-info";
import { getUserFromClerkId } from "@/lib/server-utils";

type FeedPostProps = {
  post: Prisma.PostGetPayload<{
    include: {
      user: true;
      likes: {
        select: {
          user: {
            select: {
              clerkId: true;
            };
          };
        };
      };
      _count: {
        select: {
          comments: true;
        };
      };
    };
  }>;
};

export const FeedPost = async ({ post }: FeedPostProps) => {
  const fullName = generateFullName(post.user);
  const currentUser = await getUserFromClerkId();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Image
            src={post.user.avatar ?? "noAvatar.png"}
            alt="user image"
            width="40"
            height="40"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-medium">{fullName}</span>
        </div>

        {post.userId === currentUser.userId && (
          <PostInfo postId={post.postId} />
        )}
      </div>

      <div className="flex flex-col gap-y-4">
        {post.image && (
          <div className="w-full min-h-96 relative">
            <Image
              src={post.image}
              alt="post image"
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
        <p>{post.description}</p>
      </div>

      <PostInteraction
        postId={post.postId}
        likes={post.likes.map((like) => like.user.clerkId)}
        numOfComments={post._count.comments}
      />

      <Suspense fallback="Loading...">
        <Comments postId={post.postId} />
      </Suspense>
    </div>
  );
};
