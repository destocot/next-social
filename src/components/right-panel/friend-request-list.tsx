"use client";

import { followRequestAction } from "@/lib/actions";
import { generateFullName } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type FriendRequestListProps = {
  followRequests: Array<
    Prisma.FollowRequestGetPayload<{ include: { requestingUser: true } }>
  >;
};

export const FriendRequestList = ({
  followRequests,
}: FriendRequestListProps) => {
  const [requestState, setRequestState] = useState(followRequests);
  const [optimisticRequestState, setOptimisticRequestState] = useOptimistic(
    requestState,
    (state, value: string) => {
      return state.filter((request) => request.followRequestId !== value);
    }
  );

  const accept = async (requestId: string, userId: string) => {
    setOptimisticRequestState(requestId);
    try {
      await followRequestAction(userId, "accept");
      setRequestState((prev) =>
        prev.filter((request) => request.followRequestId !== requestId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (requestId: string) => {
    setOptimisticRequestState(requestId);
    try {
      await followRequestAction(requestId, "reject");
      setRequestState((prev) =>
        prev.filter((request) => request.followRequestId !== requestId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {optimisticRequestState.map((request) => {
        const fullName = generateFullName(request.requestingUser);

        return (
          <div
            key={request.followRequestId}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-x-4">
              <Image
                src={request.requestingUser.avatar ?? "noAvatar.png"}
                alt="user image"
                width="40"
                height="40"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold">{fullName}</span>
            </div>

            <div className="flex gap-x-3 justify-end">
              <form
                action={accept.bind(
                  null,
                  request.followRequestId,
                  request.requestingUser.userId
                )}
              >
                <button>
                  <Image
                    src="/accept.png"
                    alt="accept"
                    width="20"
                    height="20"
                    className="cursor-pointer"
                  />
                </button>
              </form>

              <form action={reject.bind(null, request.followRequestId)}>
                <button>
                  <Image
                    src="/reject.png"
                    alt="reject"
                    width="20"
                    height="20"
                    className="cursor-pointer"
                  />
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </>
  );
};
