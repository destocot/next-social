"use client";

import { useUser } from "@clerk/nextjs";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import { CreatePostButton } from "./create-post-button";
import { createPost } from "@/lib/actions";
import toast from "react-hot-toast";

export const CreatePost = () => {
  const { user: clerkUser, isLoaded } = useUser();

  const [desc, setDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [image, setImage] = useState<CloudinaryUploadWidgetInfo>();

  if (!isLoaded) return "Loading...";

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex gap-x-2 justify-between text-sm">
      <Image
        src={clerkUser?.imageUrl ?? "/noAvatar.png"}
        alt="user image"
        width="48"
        height="48"
        className="w-12 h-12 object-cover rounded-full shrink-0"
      />

      <div className="grow">
        <form
          action={async (formData) => {
            const res = await createPost(formData, image?.secure_url);
            if (res.success) {
              toast.success("Post created successfully");
              setDesc("");
            }
          }}
          className="flex gap-x-2"
        >
          <textarea
            disabled={creating}
            placeholder="What's on your mind?"
            className="bg-slate-100 rounded-lg grow p-2 disabled:opacity-50 disabled:cursor-text"
            name="description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>

          <div>
            <Image
              src="/emoji.png"
              alt=""
              width="20"
              height="20"
              className="w-5 h-5 cursor-pointer self-end"
              onClick={() => {
                setDesc((prev) => prev + " 😀");
              }}
            />
            <CreatePostButton />
          </div>
        </form>

        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result, widget) => {
              setImage(result.info as CloudinaryUploadWidgetInfo);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-x-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addimage.png" alt="" width="20" height="20" />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget>

          <div className="flex items-center gap-x-2 cursor-pointer">
            <Image src="/addVideo.png" alt="" width="20" height="20" />
            Video
          </div>
          <div className="flex items-center gap-x-2 cursor-pointer">
            <Image src="/addevent.png" alt="" width="20" height="20" />
            Event
          </div>
          <div className="flex items-center gap-x-2 cursor-pointer">
            <Image src="/poll.png" alt="" width="20" height="20" />
            Poll
          </div>
        </div>
      </div>
    </div>
  );
};
