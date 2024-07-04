"use client";

import { User } from "@prisma/client";
import { blockAction, followAction } from "@/lib/actions";
import { useOptimistic, useState } from "react";

type UserInfoCardInteractionProps = {
  profileUserId: User["userId"];
  isBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
};

export const UserInfoCardInteraction = ({
  profileUserId,
  isBlocked,
  isFollowing,
  isFollowingSent,
}: UserInfoCardInteractionProps) => {
  const [userState, setUserState] = useState({
    blocked: isBlocked,
    following: isFollowing,
    followingRequestSent: isFollowingSent,
  });

  const follow = async () => {
    setOptimisticUserState("follow");
    try {
      await followAction(profileUserId);
      setUserState((prev) => ({
        ...prev,
        followingRequestSent:
          !prev.following && !prev.followingRequestSent ? true : false,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const block = async () => {
    setOptimisticUserState("block");
    try {
      await blockAction(profileUserId);
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const [optimisticUserState, setOptimisticUserState] = useOptimistic(
    userState,
    (state, action: "follow" | "block") => {
      if (action === "follow") {
        return {
          ...state,
          followingRequestSent:
            !state.following && !state.followingRequestSent ? true : false,
        };
      }

      if (action === "block") {
        return {
          ...state,
          blocked: !state.blocked,
        };
      }

      return state;
    }
  );

  return (
    <>
      <form action={follow}>
        <button
          type="submit"
          className="bg-blue-500 text-white text-sm rounded-md p-2 w-full"
        >
          {optimisticUserState.following
            ? "Following"
            : optimisticUserState.followingRequestSent
            ? " Follow Request Sent"
            : "Follow"}
        </button>
      </form>

      <form action={block} className="self-end">
        <button type="submit" className="text-red-400 text-xs cursor-pointer">
          {optimisticUserState.blocked ? "Unblock User" : "Block User"}
        </button>
      </form>
    </>
  );
};
