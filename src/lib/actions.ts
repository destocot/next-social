"use server";

import type { Post, Story, User } from "@prisma/client";
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
  prevState: null | { success: boolean },
  payload: { formData: FormData; cover?: string }
) => {
  const { formData, cover } = payload;

  if (cover) formData.set("cover", cover);
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

export const toggleLike = async (postId: Post["postId"]) => {
  const currentUser = await getUserFromClerkId();

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: currentUser.userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { likeId: existingLike.likeId },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: currentUser.userId,
        },
      });
    }

    revalidatePath("/");
  } catch (err) {
    console.error(err);
  }
};

export const addComment = async (
  postId: Post["postId"],
  description: Post["description"]
) => {
  const currentUser = await getUserFromClerkId();

  try {
    await prisma.comment.create({
      data: {
        postId,
        userId: currentUser.userId,
        description,
      },
    });

    revalidatePath("/");
  } catch (err) {
    console.error(err);
  }
};

const PostSchema = v.object({
  description: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(255)),
  image: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1))),
});

export const createPost = async (formData: FormData, image?: Post["image"]) => {
  if (image) formData.set("image", image);
  const values = Object.fromEntries(formData.entries());

  const parsedValues = v.safeParse(PostSchema, values);

  if (!parsedValues.success) {
    console.error(v.flatten(parsedValues.issues));
    return { success: false };
  }

  const data = parsedValues.output;

  try {
    const currentUser = await getUserFromClerkId();
    const userId = currentUser.userId;

    await prisma.post.create({ data: { ...data, userId } });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const createStory = async (image: Story["image"]) => {
  const currentUser = await getUserFromClerkId();

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId: currentUser.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: { storyId: existingStory.storyId },
      });
    }

    await prisma.story.create({
      data: {
        userId: currentUser.userId,
        image,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const deletePost = async (postId: Post["postId"]) => {
  const currentUser = await getUserFromClerkId();

  try {
    await prisma.post.delete({
      where: {
        postId,
        userId: currentUser.userId,
      },
    });

    revalidatePath("/");
  } catch (err) {
    console.error(err);
  }
};
