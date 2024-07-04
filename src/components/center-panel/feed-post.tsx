import Image from "next/image";

export const FeedPost = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Image
            src="https://picsum.photos/id/239/200/300"
            alt="user image"
            width="40"
            height="40"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-medium">Jack McBride</span>
        </div>
        <Image src="/more.png" alt="options" width="16" height="16" />
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="w-full min-h-96 relative">
          <Image
            src="https://picsum.photos/id/251/400/600"
            alt="post image"
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus
          ipsam odit, beatae, veritatis sint, aspernatur laudantium excepturi
          tempora impedit maiores quis animi. Praesentium corporis nobis
          sapiente nihil dolor. Voluptate, amet!
        </p>
      </div>

      <div className="flex items-center justify-between text-sm my-4">
        <div className="flex gap-x-8">
          <div className="flex items-center gap-x-4 bg-slate-50 p-2 rounded-xl">
            <Image
              src="/like.png"
              alt="like"
              width="16"
              height="16"
              className="cursor-pointer"
            />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              180 <span className="hidden md:inline">Likes</span>
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
              149 <span className="hidden md:inline">Comments</span>
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
            <span className="text-gray-500">
              160 <span className="hidden md:inline">Shares</span>
            </span>
          </div>
        </div>
      </div>
      {/* COMMENTS */}
      <Comments />
    </div>
  );
};

const Comments = () => {
  return (
    <div>
      <div className="flex items-center gap-x-4">
        <Image
          src="https://picsum.photos/id/252/400/600"
          alt="user image"
          width="32"
          height="32"
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div className="flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full grow">
          <input
            type="text"
            placeholder="Write a comment..."
            className="bg-transparent outline-none grow"
          />
          <Image
            src="/emoji.png"
            alt="emoji"
            width="16"
            height="16"
            className="cursor-pointer"
          />
        </div>
      </div>

      <div>
        <div className="flex gap-x-4 justify-between mt-6">
          <Image
            src="https://picsum.photos/id/253/400/600"
            alt="user image"
            width="40"
            height="40"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />

          <div className="flex flex-col gap-y-2">
            <span className="font-medium">Bernice Spencer</span>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus qui
              dolorem laboriosam officiis et quidem, alias at. Nesciunt, ipsa
              animi. Laudantium consequatur vel repudiandae reprehenderit
              quibusdam tempora excepturi cum aperiam!
            </p>

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
                <span className="text-gray-500">17 Likes</span>
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
      </div>
    </div>
  );
};
