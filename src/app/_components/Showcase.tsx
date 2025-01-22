import dayjs from "dayjs";
import { Earth, LockKeyhole, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import type { User, Showcase } from "~/types/types";
import { formatNumber, getInitials } from "~/utils/utils";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import Image from "next/legacy/image";
import Link from "next/link";
import CommentInput from "./CommentInput";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeButton from "./LikeButton";
import { api } from "~/trpc/react";
import Comments from "./Comments";
import FileOptions from "./FileOptions";
import SharedHoverCard from "./SharedHoverCard";

dayjs.extend(relativeTime);

const Showcase: React.FC<{
  file: Showcase;
  currentUser: User | undefined | null;
  isFullView: boolean;
}> = ({ file, currentUser, isFullView }) => {
  const { data: allComments } = api.comment.getAllComments.useQuery({
    id: file.commentsInfo?.map((comment) => comment.id) ?? [],
  });
  const sameUser = currentUser?.id === file.createdById;

  const renderCommentSection = (
    isFullView: boolean,
    file: Showcase,
    user: User | undefined | null,
  ) => {
    return isFullView ? (
      <>
        {file.filePrivacy === "public" && (
          <div className={`max-w-full ${isFullView && "self-start"}`}>
            <div className="p-2">
              {file?.commentsInfo && file.commentsInfo.length > 0 && (
                <Comments
                  isFullView={true}
                  file={file}
                  currentUser={user}
                  showcaseComments={allComments ?? []}
                />
              )}
            </div>
          </div>
        )}
        {file.filePrivacy === "public" && (
          <Card className="sticky bottom-0 w-full">
            <CardContent className="p-2">
              <CommentInput fileId={file.id} />
            </CardContent>
          </Card>
        )}
      </>
    ) : (
      file.filePrivacy === "public" && (
        <div className="w-full">
          <div className="flex flex-col gap-2">
            {file?.commentsInfo && file.commentsInfo.length > 0 && (
              <Comments
                isFullView={isFullView}
                file={file}
                currentUser={currentUser}
                showcaseComments={allComments ?? []}
              />
            )}
            <CommentInput fileId={file.id} />
          </div>
        </div>
      )
    );
  };
  return (
    <div
      key={file.id}
      className={`flex w-full flex-col items-center gap-2 ${!isFullView && "rounded-2xl border pb-2 pl-6 pr-6 pt-6"}`}
    >
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
          <SharedHoverCard file={file} />
        </div>
        {sameUser && (
          <FileOptions
            fileId={file.id}
            fileKey={file.fileKey}
            fileType={file.fileType}
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-1">
        <p>{file.caption}</p>
        <div className="flex items-center gap-1">
          {file.tags?.map((tag) => (
            <Button key={tag} variant="link" className="text-bold h-fit p-0">
              <Link href={`/${tag}`}>{file.tags}</Link>
            </Button>
          ))}
        </div>
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
          {file.filePrivacy === "private" ? (
            <LockKeyhole size={16} className="text-accent-foreground" />
          ) : (
            <Earth size={16} className="text-accent-foreground" />
          )}
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
              <Link href={`/showcases/${file.id}`}>
                <MessageCircle size={22} />
              </Link>
            </Button>
            <p>{formatNumber(file.comments)}</p>
          </div>
        </div>
      </div>
      {renderCommentSection(isFullView, file, currentUser)}
    </div>
  );
};

export default Showcase;
