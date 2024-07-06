"use client";

import { addComment } from "@/lib/actions";
import { generateFullName } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import type { Post, Prisma, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";
import { v4 as uuid } from "uuid";

type CommentWithUser = Prisma.CommentGetPayload<{ include: { user: true } }>;

type CommentsListProps = {
  comments: Array<CommentWithUser>;
  postId: Post["postId"];
};

export const CommentsList = ({ comments, postId }: CommentsListProps) => {
  const { user: clerkUser } = useUser();

  const [desc, setDesc] = useState("");
  const [adding, setAdding] = useState(false);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (
      state,
      {
        description,
        user,
      }: { description: CommentWithUser["description"]; user: User }
    ) => {
      const commentId = uuid();
      const newDate = new Date();

      return [
        {
          commentId,
          description,
          postId,
          createdAt: newDate,
          updatedAt: newDate,
          userId: user.userId,
          user,
        },
        ...state,
      ];
    }
  );

  const action = async () => {
    if (!clerkUser || !desc) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth`);
    const data = await res.json();

    const user = data.data as User;
    if (!user) return;

    setAdding(true);

    addOptimisticComment({ description: desc, user });

    try {
      await addComment(postId, desc);
    } catch (err) {
      console.error(err);
    }

    setAdding(false);
    setDesc("");
  };

  return (
    <div>
      {clerkUser && (
        <div className="flex items-center gap-x-4">
          <Image
            src={clerkUser.imageUrl ?? "/noAvatar.png"}
            alt="user image"
            width="32"
            height="32"
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <form
            action={action}
            className="flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full grow"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none grow disabled:opacity-50 disabled:cursor-text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              disabled={adding}
            />
            <Image
              src="/emoji.png"
              alt="emoji"
              width="16"
              height="16"
              className="cursor-pointer"
            />
          </form>
        </div>
      )}

      <div>
        {optimisticComments.map((comment) => {
          const fullName = generateFullName(comment.user);

          return (
            <div
              key={comment.commentId}
              className="flex gap-x-4 justify-between mt-6"
            >
              <Image
                src={comment.user.avatar ?? "/noAvatar.png"}
                alt="user image"
                width="40"
                height="40"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />

              <div className="flex flex-col gap-y-3 w-full">
                <span className="font-medium">{fullName}</span>

                <p>{comment.description}</p>

                <div className="flex items-center gap-x-8 text-xs text-gray-500">
                  <div className="flex items-center gap-x-4">
                    <Image
                      src="/like.png"
                      alt="like"
                      width="12"
                      height="12"
                      className="cursor-pointer h-4 w-4"
                    />
                    <span className="text-gray-300">|</span>
                    {/* TODO: Display Likes From DB */}
                    <span className="text-gray-500">123 Likes</span>
                  </div>

                  <div>Reply</div>
                </div>
              </div>

              <Image
                src="/more.png"
                alt="more"
                width="16"
                height="16"
                className="cursor-pointer h-4 w-4"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
