import { prisma } from "@/lib/db";
import { getUserFromClerkId } from "@/lib/server-utils";
import { StoryList } from "@/components/center-panel/story-list";

export const Stories = async () => {
  const currentUser = await getUserFromClerkId();

  if (!currentUser) return null;

  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      OR: [
        {
          user: {
            followers: {
              some: {
                followerUserId: currentUser.userId,
              },
            },
          },
        },
        {
          userId: currentUser.userId,
        },
      ],
    },
    include: { user: true },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-x-auto text-xs font-medium scrollbar-hide">
      <StoryList stories={stories} currentUser={currentUser} />
    </div>
  );
};
