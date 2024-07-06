"use client";

import { toggleLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import type { Post, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type PostInteractionProps = {
  postId: Post["postId"];
  likes: Array<User["clerkId"]>;
  numOfComments: number;
};

export const PostInteraction = ({
  postId,
  likes,
  numOfComments,
}: PostInteractionProps) => {
  const { userId: clerkId } = useAuth();

  const [likesState, setLikesState] = useState({
    likesCount: likes.length,
    isLiked: clerkId && likes.includes(clerkId),
  });

  const [optimisticLike, toggleOptimisticLike] = useOptimistic(
    likesState,
    (state, value: "init") => {
      return {
        likesCount: state.isLiked ? state.likesCount - 1 : state.likesCount + 1,
        isLiked: !state.isLiked,
      };
    }
  );

  async function likeAction() {
    toggleOptimisticLike("init");

    try {
      toggleLike(postId);
      setLikesState((state) => ({
        likesCount: state.isLiked ? state.likesCount - 1 : state.likesCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-x-8">
        <div className="flex items-center gap-x-4 bg-slate-50 p-2 rounded-xl">
          <form action={likeAction}>
            <button>
              <Image
                src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                alt="like"
                width="16"
                height="16"
                className="cursor-pointer"
              />
            </button>
          </form>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {optimisticLike.likesCount}{" "}
            <span className="hidden md:inline">Likes</span>
          </span>
        </div>

        <div className="flex items-center gap-x-4 bg-slate-50 p-2 rounded-xl">
          <Image
            src="/comment.png"
            alt="comment"
            width="16"
            height="16"
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {numOfComments} <span className="hidden md:inline">Comments</span>
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-x-4 bg-slate-50 p-2 rounded-xl">
          <Image
            src="/share.png"
            alt="share"
            width="16"
            height="16"
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="hidden md:inline text-gray-500">Shares</span>
        </div>
      </div>
    </div>
  );
};
