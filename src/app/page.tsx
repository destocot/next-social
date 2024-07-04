import { CreatePost } from "@/components/center-panel/create-post";
import { FeedPost } from "@/components/center-panel/feed-post";
import { Stories } from "@/components/center-panel/stories";
import { LeftPanel } from "@/components/left-panel/left-panel";
import { RightPanel } from "@/components/right-panel/right-panel";

export default function Page() {
  return (
    <div className="flex gap-x-6 py-6">
      <div className="hidden xl:block xl:w-1/6">
        <LeftPanel type="home" />
      </div>

      <div className="w-full lg:w-4/6 xl:w-3/6">
        <div className="flex flex-col gap-y-6">
          <Stories />
          <CreatePost />
          <FeedPost />
        </div>
      </div>

      <div className="hidden lg:block lg:w-2/6">
        <RightPanel />
      </div>
    </div>
  );
}
