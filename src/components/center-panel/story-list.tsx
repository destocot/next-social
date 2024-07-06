"use client";

import { createStory } from "@/lib/actions";
import { generateFullName } from "@/lib/utils";
import { Prisma, User } from "@prisma/client";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import Image from "next/image";
import React, { useOptimistic, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";

type StoryWithUser = Prisma.StoryGetPayload<{
  include: { user: true };
}>;

type StoryListProps = {
  stories: Array<StoryWithUser>;
  currentUser: User;
};

export const StoryList = ({ stories, currentUser }: StoryListProps) => {
  const [image, setImage] = useState<CloudinaryUploadWidgetInfo>();
  const [creating, setCreating] = useState(false);

  const [viewStory, setViewStory] = useState(false);

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    stories,
    (state, values: "init") => {
      const storyId = uuid();
      const newDate = new Date();

      if (!image) return state;

      return [
        {
          storyId,
          expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          createdAt: newDate,
          updatedAt: newDate,
          userId: currentUser.userId,
          user: currentUser,
          image: image.secure_url,
        },
      ];
    }
  );

  const action = async () => {
    if (!image?.secure_url) return;

    setCreating(true);

    addOptimisticStory("init");

    try {
      const res = await createStory(image.secure_url);
      if (res.success) {
        setImage(undefined);
        toast.success("Post created successfully");
      }
    } catch (err) {
      toast.error("Failed to create post");
    }

    setCreating(false);
  };

  return (
    <div className="flex gap-x-8 w-max">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result, widget) => {
          setImage(result.info as CloudinaryUploadWidgetInfo);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col items-center gap-y-2 cursor-pointer relative group">
              <Image
                src={image?.secure_url || currentUser.avatar || "noAvatar.png"}
                alt="user story"
                width="80"
                height="80"
                className="w-20 h-20 rounded-full ring-2 object-cover"
                onClick={() => open()}
              />
              {image ? (
                <form action={action}>
                  <button
                    type="submit"
                    disabled={creating}
                    className="font-medium px-1 py-0.5 text-white bg-blue-500 hover:bg-blue-500/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </form>
              ) : (
                <span className="font-medium">Create Story</span>
              )}
              <div
                className="absolute bg-black/50 inset-0 ring-2 ring-black/50 h-20 w-full hidden group-hover:block rounded-full"
                onClick={() => open()}
              >
                <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-3xl text-gray-200">
                  +
                </span>
              </div>
            </div>
          );
        }}
      </CldUploadWidget>

      {optimisticStories.map((story) => {
        const fullName = generateFullName(story.user);

        return (
          <React.Fragment key={story.storyId}>
            <div className="flex flex-col items-center gap-y-2 cursor-pointer relative group">
              <Image
                src={story.image}
                alt="user story"
                width="80"
                height="80"
                className="w-20 h-20 rounded-full ring-2 object-cover"
                onClick={() => setViewStory(true)}
              />
              <span className="font-medium">{fullName}</span>
              <div
                className="absolute bg-black/50 inset-0 ring-2 ring-black/50 h-20 w-full hidden group-hover:block rounded-full"
                onClick={() => setViewStory(true)}
              >
                <div className="size-4 rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-4 border-gray-200" />
              </div>
            </div>
            {viewStory && (
              <div
                className="
            fixed inset-0 bg-black/50 flex items-center justify-center z-20"
              >
                <Image
                  src={story.image}
                  alt="story"
                  width="500"
                  height="500"
                  className="rounded-xl"
                />
                <button
                  className="absolute top-5 right-5 text-white text-4xl transition hover:scale-110"
                  onClick={() => setViewStory(false)}
                >
                  &times;
                </button>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
