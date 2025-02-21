import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { api } from "~/trpc/react";
import type { Comment, Showcase } from "~/types/types";
import { extractUsernameAndText, getInitials } from "~/utils/utils";
const SharedHoverCard: React.FC<{
  isCommentOrReply: boolean;
  comment?: Comment;
  reply?: string | null;
  file?: Showcase;
}> = ({ comment, reply, isCommentOrReply, file }) => {
  const { data } = api.user.getUserByUsername.useQuery(
    {
      username: reply ?? "",
    },
    {
      enabled: !!reply,
    },
  );
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button tabIndex={-1} variant="link" className="h-fit p-0 font-bold">
          <Link
            className={`${isCommentOrReply && "text-blue-800"}`}
            href={`/${comment?.user?.name ?? data?.name ?? file?.user?.name}`}
          >
            {isCommentOrReply && '@'}{comment?.user?.name ?? data?.name ?? file?.user?.name}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="right" className="w-80 p-2">
        <div className="flex items-center justify-start space-x-4">
          <Avatar className="h-16 w-16 flex items-center justify-center">
            <AvatarImage
              className="rounded-full"
              src={
                comment?.user?.profileImage?.imageUrl ??
                data?.profileImage?.imageUrl ??
                file?.user?.profileImage?.imageUrl
              }
            />
            <AvatarFallback className="bg-muted flex w-1/2 h-1/2 rounded-full items-center justify-center">
              {getInitials(
                comment?.user?.firstName ??
                data?.firstName ??
                file?.user?.firstName ??
                "",
                comment?.user?.lastName ??
                data?.lastName ??
                file?.user?.lastName ??
                "",
              )}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 ml-0">
            <h4 className="text-sm font-semibold">
              @{comment?.user?.name ?? data?.name ?? file?.user?.name}
            </h4>
            <div className="text-sm">
              {extractUsernameAndText(comment?.user.bio ?? data?.bio ?? file?.user?.bio).previousText}
              {" "}
              {extractUsernameAndText(comment?.user.bio ?? data?.bio ?? file?.user?.bio).username &&
                <Button tabIndex={-1} variant="link" className="h-fit p-0 font-bold">
                  <Link
                    className="text-blue-800 text-xs"
                    href={`/${extractUsernameAndText(comment?.user.bio ?? data?.bio ?? file?.user?.bio).username}`}
                  >
                    {'@' + extractUsernameAndText(comment?.user.bio ?? data?.bio ?? file?.user?.bio).username}
                  </Link>
                </Button>
              }

              {" "}
              {extractUsernameAndText(comment?.user.bio ?? data?.bio ?? file?.user?.bio).followingText}

            </div>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined{" "}
                {dayjs((comment?.user ?? file?.user ?? data)?.createdAt).format(
                  "MMMM",
                )}{" "}
                {dayjs((comment?.user ?? file?.user ?? data)?.createdAt).format(
                  "YYYY",
                )}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SharedHoverCard;
