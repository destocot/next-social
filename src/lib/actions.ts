"use server";

import { User } from "@prisma/client";
import {
  getFollowRequestStatus,
  getFollowStatus,
  getUserBlockedStatus,
  getUserFromClerkId,
} from "@/lib/server-utils";
import { prisma } from "@/lib/db";
import * as v from "valibot";
import { revalidatePath } from "next/cache";

export const followAction = async (profileUserId: User["userId"]) => {
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

export const blockAction = async (profileUserId: User["userId"]) => {
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

export const followRequestAction = async (
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

const ProfileSchema = v.object({
  name: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(60))
  ),
  surname: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(60))
  ),
  description: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(255))
  ),
  city: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(60))
  ),
  school: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(60))
  ),
  work: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(60))
  ),
  website: v.optional(
    v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(60))
  ),
  cover: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1))),
});

export const updateProfile = async (
  formData: FormData,
  secure_url?: string
) => {
  if (secure_url) formData.set("cover", secure_url);
  const values = Object.fromEntries(formData.entries());

  for (const key in values) {
    if (values[key] === "") delete values[key];
  }

  const parsedValues = v.safeParse(ProfileSchema, values);

  if (!parsedValues.success) {
    console.error(v.flatten(parsedValues.issues));
    return { success: false };
  }

  const data = parsedValues.output;

  try {
    const currentUser = await getUserFromClerkId();
    const userId = currentUser.userId;

    await prisma.user.update({ where: { userId }, data });
    revalidatePath(`/profile/${currentUser.username}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
