import { prisma } from "@/lib/db";
import Link from "next/link";
import { getUserFromClerkId } from "@/lib/server-utils";
import { FriendRequestList } from "@/components/right-panel/friend-request-list";

export const FriendRequests = async () => {
  const currentUser = await getUserFromClerkId();

  const followRequests = await prisma.followRequest.findMany({
    where: { acceptingUserId: currentUser.userId },
    include: { requestingUser: true },
  });

  if (followRequests.length === 0) return null;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-sm flex flex-col gap-y-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>

      <FriendRequestList followRequests={followRequests} />
    </div>
  );
};
