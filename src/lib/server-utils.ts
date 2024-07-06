import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import type { Block, Follow, User } from "@prisma/client";
import { delay } from "@/lib/utils";

export async function getUserFromClerkId() {
  try {
    const { userId: clerkId } = auth();

    if (!clerkId) {
      throw new Error("No Clerk ID found");
    }

    const user = await findUserByClerkId(clerkId);
    if (user) return user;

    // account for latency in creating a new user via webhook
    const userFromRetry = await retryFindUserByClerkId(clerkId);
    if (userFromRetry) return userFromRetry;

    throw new Error("User not found");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function findUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
  });
}

async function retryFindUserByClerkId(clerkId: string) {
  let count = 0;

  while (count < 3) {
    await delay(1000);
    count++;

    const user = await findUserByClerkId(clerkId);
    if (user) return user;
  }

  return null;
}

export async function getUserBlockedStatus(
  profileUserId: Block["blockingUserId"]
) {
  const currentUser = await getUserFromClerkId();

  const blocked = await prisma.block.findUnique({
    where: {
      blockedUserId_blockingUserId: {
        blockingUserId: profileUserId,
        blockedUserId: currentUser.userId,
      },
    },
    select: { blockId: true },
  });

  return blocked;
}

export async function getFollowStatus(profileUserId: Follow["followerUserId"]) {
  const currentUser = await getUserFromClerkId();

  const follow = await prisma.follow.findUnique({
    where: {
      followerUserId_followingUserId: {
        followerUserId: profileUserId,
        followingUserId: currentUser.userId,
      },
    },
    select: { followId: true },
  });

  return follow;
}

export async function getFollowRequestStatus(
  profileUserId: User["userId"],
  perspective: "profile" | "user"
) {
  const currentUser = await getUserFromClerkId();

  const acceptingUserId =
    perspective === "profile" ? profileUserId : currentUser.userId;

  const requestingUserId =
    perspective === "profile" ? currentUser.userId : profileUserId;

  const followRequest = await prisma.followRequest.findUnique({
    where: {
      requestingUserId_acceptingUserId: {
        acceptingUserId,
        requestingUserId,
      },
    },
    select: { followRequestId: true },
  });

  return followRequest;
}
