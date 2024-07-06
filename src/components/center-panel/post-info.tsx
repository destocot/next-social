"use client";

import { deletePost } from "@/lib/actions";
import type { Post } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

type PostInfoProps = { postId: Post["postId"] };

export const PostInfo = ({ postId }: PostInfoProps) => {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        onClick={onClick}
        className="cursor-pointer p-0.5 hover:bg-yellow-100"
      >
        <Image src="/more.png" alt="options" width="16" height="16" />
      </div>
      {open && (
        <div className="absolute right-0 top-4 bg-white shadow-lg z-30 flex flex-col text-sm rounded-lg overflow-hidden">
          <span className="cursor-pointer px-4 py-2 hover:bg-gray-100">
            View
          </span>

          <span className="cursor-pointer px-4 py-2 hover:bg-gray-100">
            Repost
          </span>

          <form
            action={deletePost.bind(null, postId)}
            className="px-4 py-2 hover:bg-gray-100"
          >
            <button type="submit">Delete</button>
          </form>
        </div>
      )}
    </div>
  );
};
