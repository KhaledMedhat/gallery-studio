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
import { getInitials } from "~/utils/utils";
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
      <HoverCardContent side="right" className="w-80">
        <div className="z-50 flex items-center justify-start space-x-4">
          <Avatar className="h-16 w-16 md:h-20 md:w-20">
            <AvatarImage
              className="rounded-full"
              src={
                comment?.user?.profileImage?.imageUrl ??
                data?.profileImage?.imageUrl ??
                file?.user?.profileImage?.imageUrl
              }
            />
            <AvatarFallback>
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
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              @{comment?.user?.name ?? data?.name ?? file?.user?.name}
            </h4>
            <p className="text-sm">
              {comment?.user?.bio ?? data?.bio ?? file?.user?.bio ?? ""}
            </p>
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
