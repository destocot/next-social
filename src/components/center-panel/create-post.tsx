import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export const CreatePost = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex gap-x-4 justify-between text-sm">
      <Image
        src="https://picsum.photos/id/238/200/300"
        alt="user image"
        width="48"
        height="48"
        className="w-12 h-12 object-cover rounded-full shrink-0"
      />

      <div className="grow">
        <form className="flex gap-x-4">
          <textarea
            placeholder="What's on your mind?"
            className="bg-slate-100 rounded-lg grow p-2"
            name="description"
          ></textarea>
          <Image
            src="/emoji.png"
            alt=""
            width="20"
            height="20"
            className="w-5 h-5 cursor-pointer self-end"
          />
        </form>

        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <div className="flex items-center gap-x-2 cursor-pointer">
            <Image src="/addimage.png" alt="" width="20" height="20" />
            Photo
          </div>
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
