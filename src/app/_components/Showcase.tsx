import dayjs from "dayjs";
import { Earth, LockKeyhole, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import type { User, Showcase } from "~/types/types";
import { calculateClosestAspectRatio, formatNumber, getInitials } from "~/utils/utils";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import CommentInput from "./CommentInput";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import FileOptions from "./FileOptions";
import SharedHoverCard from "./SharedHoverCard";
import { useState } from "react";

dayjs.extend(relativeTime);

const Showcase: React.FC<{
  file: Showcase | undefined;
  currentUser: User | undefined | null;
  isFullView: boolean;
  isWideAspectRatio: boolean;
}> = ({ file, currentUser, isFullView, isWideAspectRatio }) => {
  const sameUser = currentUser?.id === file?.createdById;
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    const { naturalWidth, naturalHeight } = img;

    // Calculate the closest aspect ratio
    const { width, height } = calculateClosestAspectRatio(naturalWidth, naturalHeight);

    // Update the dimensions state
    setDimensions({ width: width, height: height });
  };

  console.log(dimensions);

  const renderCommentSection = (
    isFullView: boolean,
    file: Showcase,
    user: User | undefined | null,
  ) => {
    return isFullView ? (
      <>
        {file?.filePrivacy === "public" && (
          <div className={`max-w-full ${isFullView && "self-start"}`}>
            <div className="p-2">
              {file?.commentsInfo && file?.commentsInfo.length > 0 && (
                <Comments
                  isFullView={true}
                  file={file}
                  currentUser={user}
                  showcaseComments={file?.comments ?? []}
                />
              )}
            </div>
          </div>
        )}
        {file?.filePrivacy === "public" && (
          <Card className="sticky bottom-4 w-full">
            <CardContent className="p-2">
              <CommentInput fileId={file?.id} />
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
                showcaseComments={file?.comments ?? []}
              />
            )}
            <CommentInput fileId={file?.id} />
          </div>
        </div>
      )
    );
  };
  return (
    <div
      key={file?.id}
      className={`flex w-full max-w-[800px] flex-col items-center gap-2 ${!isFullView && "rounded-2xl border pb-2 pl-6 pr-6 pt-6"}`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={file?.user?.profileImage?.imageUrl ?? ""} />
            <AvatarFallback>
              {getInitials(
                file?.user?.firstName ?? "",
                file?.user?.lastName ?? "",
              )}
            </AvatarFallback>
          </Avatar>
          <SharedHoverCard file={file} />
        </div>
        {sameUser && (
          <FileOptions
            fileId={file?.id ?? ""}
            fileKey={file?.fileKey ?? ""}
            fileType={file?.fileType ?? ""}
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-1">
        <p>{file?.caption}</p>
        <div className="flex items-center gap-1">
          {file?.tags?.map((tag) => (
            <Button key={tag} variant="link" className="text-bold h-fit p-0">
              <Link href={`/search?q=${tag.slice(1)}`}>{tag}</Link>
            </Button>
          ))}
        </div>
        <Link href={`/showcases/${file?.id}`}>
          {file?.fileType?.includes("video") ? (
            <Video url={file.url} className="rounded-lg xl:h-[752px]" />
          ) : isWideAspectRatio ? (
            <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
              <Image
                priority
                src={file?.url ?? ""}
                alt={`One of ${file?.user?.name}'s images`}
                layout="fill"
                className="h-full w-full rounded-md object-contain"
              />
            </AspectRatio>
          ) : (
            // <div
            //   className="relative w-full"
            //   style={{
            //     height: `${imageDimensions.height}px`,
            //     width: `${imageDimensions.width}px`,
            //   }}
            // >
            //   <Image
            //     priority
            //     src={file?.url ?? ""}
            //     alt={`One of ${file?.user?.name}'s images`}
            //     layout="fill"
            //     objectFit="cover"
            //     objectPosition="center"
            //     className="rounded-lg object-cover center"
            //   />
            // </div>
            <div className="relative w-full" style={{ height: 'auto', aspectRatio: '1/1' }}>
              <Image
                src={file?.url ?? ""}
                alt={`One of ${file?.user?.name}'s images`}
                // width={dimensions.width}
                // height={dimensions.height}
                fill
                onLoad={handleImageLoad}
                className="rounded-md " // Changed to object-cover
              />
            </div>
            // <div
            //   style={{
            //     position: "relative",
            //     height: "auto",
            //     aspectRatio: "1/1",
            //   }}
            // >
            //   <Image
            //     priority
            //     fill
            //     src={file?.url ?? ""}
            //     alt={`One of ${file?.user?.name}'s images`}
            //     // width={imageDimensions.width}
            //     // height={imageDimensions.height}
            //     // onLoad={handleImageLoad}
            //     style={{
            //       aspectRatio: "1/1",
            //       width: "100%",
            //       height: "100%",
            //     }}
            //     className="rounded-lg"
            //     objectFit="cover"
            //     objectPosition="center"
            //   />
            // </div>
          )}
        </Link>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-accent-foreground">
            {dayjs(file?.createdAt).fromNow()}
          </p>
          <span className="block h-1 w-1 rounded-full bg-accent-foreground"></span>
          {file?.filePrivacy === "private" ? (
            <LockKeyhole size={16} className="text-accent-foreground" />
          ) : (
            <Earth size={16} className="text-accent-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <LikeButton
            fileId={file?.id}
            userId={currentUser?.id}
            likesCount={file?.likesInfo?.length}
            fileLikesInfo={file?.likesInfo}
            likedUsers={file?.likedUsers}
          />
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <Link href={`/showcases/${file?.id}`}>
                <MessageCircle size={22} />
              </Link>
            </Button>
            <p>{formatNumber(file?.commentsCount ?? 0)}</p>
          </div>
        </div>
      </div>
      {renderCommentSection(isFullView, file ?? ({} as Showcase), currentUser)}
    </div>
  );
};

export default Showcase;
