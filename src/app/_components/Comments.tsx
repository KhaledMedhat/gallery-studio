import { CalendarIcon, Ellipsis } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import type { User, Comment, Showcase } from "~/types/types";
import {
  extractComment,
  extractUsername,
  extractUsernameWithoutAt,
  getInitials,
} from "~/utils/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Separator } from "~/components/ui/separator";
import LikeButton from "./LikeButton";
import { useFileStore } from "~/store";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { cookies } from "next/headers";

dayjs.extend(relativeTime);

const Comments: React.FC<{
  slicedComments: Comment[];
  currentUser: User | undefined | null;
  isFullView: boolean;
  file: Showcase;
}> = ({ slicedComments, currentUser, file, isFullView }) => {
  const { setIsCommenting, setIsReplying, setCommentInfo } = useFileStore();
  const [isCommentUpdating, setCommentIsUpdating] = useState<boolean>(false);
  const utils = api.useUtils();
  const { mutate: deleteComment, isPending: isDeletingComment } =
    api.comment.deleteComment.useMutation({
      onSuccess: () => {
        void utils.comment.getAllComments.invalidate();
      },
    });
  const theme = useTheme();
  const renderComments = (comments: Comment[], isReply = false) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`w-full ${isReply && "ml-8"}`}>
        <div className="max-w-full">
          <div className="flex items-start justify-start gap-6">
            <div
              className={`flex items-start gap-1 ${isReply ? "max-w-[60%] lg:max-w-[70%]" : "max-w-[80%] lg:max-w-[90%]"}`}
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user?.image?.imageUrl ?? ""} />
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
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div
                  className={`${theme.resolvedTheme === "dark" ? "bg-accent" : "bg-gray-200"} rounded-md px-2 py-1`}
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="h-fit p-0 font-bold">
                        <Link href={`/${comment?.user?.name}`}>
                          {comment.user?.name}
                        </Link>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex items-center justify-start space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comment.user?.image?.imageUrl ?? ""}
                          />
                          <AvatarFallback>
                            {getInitials(
                              comment.user?.firstName ?? "",
                              comment.user?.lastName ?? "",
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">
                            @{comment.user?.name}
                          </h4>
                          <p className="text-sm">
                            {comment.user?.bio ? `${comment.user?.bio}.` : ""}
                          </p>
                          <div className="flex items-center pt-2">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            <span className="text-xs text-muted-foreground">
                              Joined{" "}
                              {dayjs(comment.user?.createdAt).format("MMMM")}{" "}
                              {dayjs(comment.user?.createdAt).format("YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <p className="break-words text-sm">
                    {extractUsername(comment.content) && (
                      <Button variant="link" className="h-fit p-0 font-bold">
                        <Link
                          className="h-fit"
                          href={`/${extractUsernameWithoutAt(comment.content)}`}
                        >
                          {extractUsername(comment.content)}
                        </Link>
                      </Button>
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
                  <Button variant="link" className="h-fit p-0 font-bold">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
            {currentUser?.id === comment.user?.id && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-fit p-0 hover:bg-transparent"
                  >
                    <Ellipsis size={30} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="p-0 hover:outline-none">
                      <Button
                        onClick={() => setCommentIsUpdating(true)}
                        variant="ghost"
                        className="w-full cursor-pointer p-0 hover:bg-transparent"
                      >
                        Edit
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-0 text-destructive hover:bg-transparent hover:outline-none">
                      <Button
                        onClick={() => deleteComment({ id: comment.id })}
                        variant="ghost"
                        className="w-full hover:text-[#d33939]"
                        disabled={isDeletingComment}
                      >
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        {comment.replies && renderComments(comment.replies.slice(0, 2), true)}
      </div>
    ));
  };
  return (
    <div className="flex flex-col gap-2">
      {renderComments(isFullView ? slicedComments : slicedComments.slice(0, 2))}
      {file.comments > 2 && (
        <Button className="self-start p-2" variant="link">
          <Button variant="link">
            <Link href={`/showcases/${file.id}?comments=true`}>
              Show all comments
            </Link>
          </Button>
        </Button>
      )}
    </div>
  );
};

export default Comments;
