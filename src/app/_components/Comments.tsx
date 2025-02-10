import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  type User,
  type Comment,
  type Showcase,
} from "~/types/types";
import {
  extractComment,
  extractUsername,
  extractUsernameWithoutAt,
  getCommentWithHighestRatio,
  getInitials,
} from "~/utils/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Separator } from "~/components/ui/separator";
import LikeButton from "./LikeButton";
import { useFileStore } from "~/store";
import { useTheme } from "next-themes";
import React from "react";
import SharedHoverCard from "./SharedHoverCard";
import CommentOptions from "./CommentOptions";

dayjs.extend(relativeTime);

const Comments: React.FC<{
  showcaseComments: Comment[];
  currentUser: User | undefined | null;
  isFullView: boolean;
  imageWidth?: number;
  file: Showcase;
}> = ({ showcaseComments, currentUser, imageWidth, file, isFullView }) => {
  const { setReplyData } = useFileStore();

  const theme = useTheme();
  const renderComments = (comments: Comment[], isReply = false) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className={`w-full ${isReply && "ml-8"} overflow-x-hidden`}
      >
        <div className="max-w-full">
          <div className="flex items-start justify-start gap-6">
            <div
              style={{
                maxWidth: imageWidth ? `${imageWidth}px` : "auto",
              }}
              className="flex items-start gap-1"
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user?.profileImage?.imageUrl ?? ""}
                  />
                  <AvatarFallback
                    className={`${theme.resolvedTheme === "dark" ? "border-2 border-solid border-white" : "border-2 border-solid border-black"} text-sm`}
                  >
                    {getInitials(
                      comment.user?.firstName ?? "",
                      comment.user?.lastName ?? "",
                    )}
                  </AvatarFallback>
                </Avatar>
                {comment.replies && comment.replies?.length > 0 && (
                  <Separator
                    orientation="vertical"
                    className={`absolute left-4 top-10 h-[4.5rem] ${theme.resolvedTheme === "dark" ? "bg-accent" : "bg-accent-foreground"}`}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div
                  className={`${theme.resolvedTheme === "dark" ? "bg-accent" : "bg-gray-200"} flex flex-col gap-1 rounded-md px-2 py-1`}
                >
                  <div className="flex items-center gap-8 justify-between">
                    <SharedHoverCard comment={comment} />
                    {currentUser?.id === comment.user?.id && (
                      <CommentOptions commentContent={comment.content} commentId={comment.id} />
                    )}
                  </div>

                  <p className="break-words text-sm">
                    {extractUsername(comment.content) && (
                      <SharedHoverCard
                        reply={extractUsernameWithoutAt(comment.content)}
                      />
                    )}{" "}
                    {extractComment(comment.content)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <LikeButton
                    userId={currentUser?.id}
                    commentId={comment.id}
                    likesCount={comment.likesInfo?.length}
                    commentLikesInfo={comment.likesInfo}
                    likedUsers={comment.likedUsers}
                  />
                  <Button
                    onClick={() =>
                      setReplyData({
                        commentId: comment.id,
                        content: `@${comment.user.name} `,
                        isReplying: true,
                      })
                    }
                    variant="link"
                    className="h-fit p-0 font-bold"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {comment.replies && renderComments(comment.replies.slice(0, 2), true)}
      </div>
    ));
  };
  const topComment = getCommentWithHighestRatio(showcaseComments);
  return (
    <div className="flex flex-col gap-2">
      {renderComments(isFullView ? showcaseComments : topComment)}
      {file.commentsCount > 1 && !isFullView && (
        <Button variant="link" className="h-fit self-start p-0">
          <Link href={`/showcases/${file.id}`} className="h-full w-full">
            Show all comments
          </Link>
        </Button>
      )}
    </div>
  );
};

export default Comments;
