import dayjs from "dayjs";
import { CalendarIcon, Earth, MessageCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import type { User, Showcase } from "~/types/types";
import { formatNumber, getInitials } from "~/utils/utils";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import Image from "next/legacy/image";
import Link from "next/link";
import CommentInput from "./CommentInput";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeButton from "./LikeButton";
import { api } from "~/trpc/react";
import Comments from "./Comments";
import FileOptions from "./FileOptions";

dayjs.extend(relativeTime);

const Showcase: React.FC<{
  file: Showcase;
  currentUser: User | undefined | null;
}> = ({ file, currentUser }) => {
  const { data: allComments } = api.comment.getAllComments.useQuery({
    id: file.commentsInfo?.map((comment) => comment.id) ?? [],
  });
  const sameUser = currentUser?.id === file.createdById;
  return (
    <div key={file.id} className="flex w-full flex-col items-center gap-2 pt-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={file.user?.image?.imageUrl ?? ""} />
            <AvatarFallback>
              {getInitials(
                file.user?.firstName ?? "",
                file.user?.lastName ?? "",
              )}
            </AvatarFallback>
          </Avatar>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="p-0 font-bold">
                <Link href={`/${file?.user?.name}`}>@{file.user?.name}</Link>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex items-center justify-start space-x-4">
                <Avatar>
                  <AvatarImage src={file.user?.image?.imageUrl ?? ""} />
                  <AvatarFallback>
                    {getInitials(
                      file.user?.firstName ?? "",
                      file.user?.lastName ?? "",
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@{file.user?.name}</h4>
                  <p className="text-sm">
                    {file.user?.bio ? `${file.user?.bio}.` : ""}
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      Joined {dayjs(file.user?.createdAt).format("MMMM")}{" "}
                      {dayjs(file.user?.createdAt).format("YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        {sameUser && (
          <FileOptions
            fileId={file.id}
            fileKey={file.fileKey}
            fileType={file.fileType}
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <p>{file.caption}</p>
        <p>{file.tags}</p>
        <Link href={`/showcases/${file.id}`}>
          {file.fileType?.includes("video") ? (
            <Video url={file.url} className="rounded-lg xl:h-[752px]" />
          ) : (
            <div className="aspect-w-2 aspect-h-1 h-auto w-full">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                  priority
                  src={file.url}
                  alt={`One of ${file.user?.name}'s images`}
                  layout="fill"
                  className="h-full w-full rounded-md object-contain"
                />
              </AspectRatio>
            </div>
          )}
        </Link>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-accent-foreground">
            {dayjs(file.createdAt).fromNow()}
          </p>
          <span className="block h-1 w-1 rounded-full bg-accent-foreground"></span>
          <Earth size={16} className="text-accent-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <LikeButton
            fileId={file.id}
            userId={currentUser?.id}
            likesCount={file.likesInfo?.length}
            fileLikesInfo={file.likesInfo}
            likedUsers={file.likedUsers}
          />
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              {/* <Link href={`/showcases/${file.id}`} > */}
              <MessageCircle size={22} />
              {/* </Link> */}
            </Button>
            <p>{formatNumber(file.comments)}</p>
          </div>
        </div>
      </div>
      <Card className="w-full">
        <CardContent className="flex flex-col gap-2 p-2">
          {file?.commentsInfo && file.commentsInfo.length > 0 && (
            <Comments
              isFullView={false}
              file={file}
              currentUser={currentUser}
              slicedComments={allComments ?? []}
            />
          )}
          <CommentInput fileId={file.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Showcase;
