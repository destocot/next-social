import { prisma } from "@/lib/db";
import type { Post } from "@prisma/client";
import { CommentsList } from "./comments-list";

type CommentsProps = { postId: Post["postId"] };

export const Comments = async ({ postId }: CommentsProps) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return <CommentsList comments={comments} postId={postId} />;
};
