"use server";

import { User } from "@prisma/client";
import {
  getFollowRequestStatus,
  getFollowStatus,
  getUserBlockedStatus,
  getUserFromClerkId,
} from "@/lib/server-utils";
import { prisma } from "@/lib/db";

const followAction = async (profileUserId: User["userId"]) => {
  const currentUser = await getUserFromClerkId();

  try {
    const existingFollow = await getFollowStatus(profileUserId);

    if (existingFollow?.followId) {
      await prisma.follow.delete({
        where: { followId: existingFollow.followId },
      });
    } else {
      const existingFollowRequest = await getFollowRequestStatus(
        profileUserId,
        "profile"
      );

      if (existingFollowRequest?.followRequestId) {
        await prisma.followRequest.delete({
          where: { followRequestId: existingFollowRequest.followRequestId },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            acceptingUserId: profileUserId,
            requestingUserId: currentUser.userId,
          },
        });
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const blockAction = async (profileUserId: User["userId"]) => {
  const currentUser = await getUserFromClerkId();

  try {
    const existingBlock = await getUserBlockedStatus(profileUserId);

    if (existingBlock?.blockId) {
      await prisma.block.delete({
        where: { blockId: existingBlock.blockId },
      });
    } else {
      await prisma.block.create({
        data: {
          blockedUserId: profileUserId,
          blockingUserId: currentUser.userId,
        },
      });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const followRequestAction = async (
  profileUserId: User["userId"],
  type: "accept" | "reject"
) => {
  const currentUser = await getUserFromClerkId();

  try {
    const existingFollowRequest = await getFollowRequestStatus(
      profileUserId,
      "user"
    );

    if (existingFollowRequest?.followRequestId) {
      await prisma.followRequest.delete({
        where: { followRequestId: existingFollowRequest.followRequestId },
      });
    }

    if (type === "accept") {
      await prisma.follow.create({
        data: {
          followerUserId: currentUser.userId,
          followingUserId: profileUserId,
        },
      });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { followAction, blockAction, followRequestAction };
