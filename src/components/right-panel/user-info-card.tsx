import {
  getFollowRequestStatus,
  getFollowStatus,
  getUserBlockedStatus,
  getUserFromClerkId,
} from "@/lib/server-utils";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { UserInfoCardInteraction } from "@/components/right-panel/user-info-card-interaction";
import { generateFullName } from "@/lib/utils";
import { UpdateUser } from "@/components/right-panel/update-user";

type UserInfoCardProps = {
  profileUser: User & {
    _count: { followers: number; following: number; posts: number };
  };
};

export const UserInfoCard = async ({ profileUser }: UserInfoCardProps) => {
  const fullName = generateFullName(profileUser);

  const createdAtDate = new Date(profileUser.createdAt);

  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentUser = await getUserFromClerkId();
  const isBlocked = getUserBlockedStatus(profileUser.userId);
  const isFollowing = getFollowStatus(profileUser.userId);
  const isFollowingSent = getFollowRequestStatus(profileUser.userId, "profile");

  const res = await Promise.all([isBlocked, isFollowing, isFollowingSent]);
  const [blocked, following, followingSent] = res;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>

        {currentUser.userId === profileUser.userId ? (
          <UpdateUser user={currentUser} />
        ) : (
          <Link href="/" className="text-blue-500 text-xs">
            See all
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-y-4 text-gray-500">
        <div className="flex items-center gap-x-2">
          <span className="text-xl text-black">{fullName}</span>
          <span className="text-sm">@{profileUser.username}</span>
        </div>

        {profileUser.description && <p>{profileUser.description}</p>}

        {profileUser.city && (
          <div className="flex items-center gap-x-2">
            <Image src="/map.png" alt="map" width="16" height="16" />(
            <span>
              Living in{" "}
              <span className="font-semibold">{profileUser.city}</span>
            </span>
            )
          </div>
        )}

        {profileUser.school && (
          <div className="flex items-center gap-x-2">
            <Image src="/school.png" alt="map" width="16" height="16" />(
            <span>
              Went to{" "}
              <span className="font-semibold">{profileUser.school}</span>
            </span>
            )
          </div>
        )}

        {profileUser.work && (
          <div className="flex items-center gap-x-2">
            <Image src="/work.png" alt="map" width="16" height="16" />(
            <span>
              Works at <span className="font-semibold">{profileUser.work}</span>
            </span>
            )
          </div>
        )}

        <div className="flex items-center justify-between">
          {profileUser.website && (
            <div className="flex gap-x-1 items-center">
              <Image src="/link.png" alt="link" width="16" height="16" />
              <Link href="#" className="text-blue-500 font-medium">
                {profileUser.website}
              </Link>
            </div>
          )}

          <div className="flex gap-x-1 items-center">
            <Image src="/date.png" alt="link" width="16" height="16" />
            <span>Joined {formattedDate}</span>
          </div>
        </div>

        {currentUser.userId !== profileUser.userId && (
          <UserInfoCardInteraction
            profileUserId={profileUser.userId}
            isBlocked={!!blocked}
            isFollowing={!!following}
            isFollowingSent={!!followingSent}
          />
        )}
      </div>
    </div>
  );
};
