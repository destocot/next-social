import { Feed } from "@/components/center-panel/feed";
import { UserProfileHeader } from "@/components/center-panel/user-profile-header";
import { LeftPanel } from "@/components/left-panel/left-panel";
import { RightPanel } from "@/components/right-panel/right-panel";
import { prisma } from "@/lib/db";
import { getUserBlockedStatus } from "@/lib/server-utils";
import { notFound } from "next/navigation";

type PageProps = { params: { username: string } };

export default async function Page({ params }: PageProps) {
  const username = params.username;

  const profileUser = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { followers: true, following: true, posts: true } },
    },
  });

  if (!profileUser) notFound();

  const isBlocked = await getUserBlockedStatus(profileUser.userId);

  if (isBlocked) notFound();

  return (
    <div className="flex gap-x-6 py-6">
      <div className="hidden xl:block xl:w-1/6">
        <LeftPanel type="profile" />
      </div>

      <div className="w-full lg:w-4/6 xl:w-3/6">
        <div className="flex flex-col gap-y-6">
          <UserProfileHeader profileUser={profileUser} />
          <Feed username={profileUser.username} />
        </div>
      </div>

      <div className="hidden lg:block lg:w-2/6">
        <RightPanel profileUser={profileUser} />
      </div>
    </div>
  );
}
