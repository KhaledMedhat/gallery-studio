import dayjs from "dayjs";
import { Earth, LockKeyhole, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { type User, type Showcase, MentionType, ElementType } from "~/types/types";
import { calculateClosestAspectRatio, formatNumber, getInitials } from "~/utils/utils";
import Video from "./Video";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import FileOptions from "./FileOptions";
import SharedHoverCard from "./SharedHoverCard";
import { useEffect, useState } from "react";
import MentionInput from "./MentionInput";
import * as React from "react";
import UpdateFileView from "./UpdateFileView";

dayjs.extend(relativeTime);

const Showcase: React.FC<{
  file: Showcase | undefined;
  currentUser: User | undefined | null;
  isFullView: boolean;
}> = ({ file, currentUser, isFullView }) => {
  const [isShowcaseUpdating, setIsShowcaseUpdating] = useState<boolean>(false);
  const sameUser = currentUser?.id === file?.createdById;
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    const { clientHeight, clientWidth } = img;

    setImageDimensions({
      height: clientHeight,
      width: clientWidth,
    });
    // Calculate the closest aspect ratio
    const { width, height } = calculateClosestAspectRatio(clientWidth, clientHeight);

    setDimensions({ width, height });

  };


  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById(`${file?.id}`);
      if (container?.childNodes[0] instanceof HTMLElement) {

        const newContainerHeight = container.childNodes[0].clientHeight
        const newContainerWidth = container.childNodes[0].clientWidth

        setImageDimensions({
          height: newContainerHeight,
          width: newContainerWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions, file?.id]);
  const aspectRatio = dimensions.width / dimensions.height;
  const targetAspectRatio = 16 / 9;
  const isEquivalent = Math.abs(aspectRatio - targetAspectRatio) < 0.01;

  const renderCommentSection = (
    isFullView: boolean,
    file: Showcase,
    user: User | undefined | null,
  ) => {
    return isFullView ? (
      <>
        {file?.filePrivacy === "public" && (
          <div className="self-start">
            <div className="p-2">
              {file?.commentsInfo && file?.commentsInfo.length > 0 && (
                <Comments
                  imageWidth={imageDimensions.width}
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
          <Card className="sticky w-full">
            <CardContent className="p-2">
              <MentionInput currentUser={currentUser} fileId={file.id} mentionType={MentionType.FOLLOWINGS} inputType={ElementType.INPUT} />
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
                imageWidth={imageDimensions.width}
                isFullView={isFullView}
                file={file}
                currentUser={currentUser}
                showcaseComments={file?.comments ?? []}
              />
            )}
            <MentionInput currentUser={currentUser} fileId={file.id} mentionType={MentionType.FOLLOWINGS} inputType={ElementType.INPUT} />
          </div>
        </div>
      )
    );
  };
  return (
    <div
      key={file?.id}
      className={`flex w-full flex-col items-center gap-2 ${!isFullView && "rounded-2xl border pb-2 pl-6 pr-6 pt-6"}`}
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
          <SharedHoverCard isCommentOrReply={false} file={file} />
        </div>
        {sameUser && (
          <FileOptions
            setIsUpdating={setIsShowcaseUpdating}
            isUpdating={isShowcaseUpdating}
            fileId={file?.id ?? ""}
            fileKey={file?.fileKey ?? ""}
            fileType={file?.fileType ?? ""}
          />
        )}
      </div>
      {isShowcaseUpdating && sameUser ?
        <UpdateFileView setIsUpdating={setIsShowcaseUpdating} file={file ?? {} as Showcase} username={file?.user?.name} /> :
        <div className="flex w-full flex-col gap-1">
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
              ) :
                <div id={file?.id} className={`relative w-full`} style={{ height: `${isEquivalent ? 'auto' : `${imageDimensions.height}px`}`, aspectRatio: `${dimensions.width} / ${dimensions.height}` }}>
                  <Image
                    priority
                    src={file?.url ?? ""}
                    alt={`One of ${file?.user?.name}'s images`}
                    fill
                    onChange={(e) => console.log(e)}
                    onLoad={handleImageLoad}
                    className={`rounded-md !h-auto ${isEquivalent ? 'object-fit  !absolute !top-[50%] !-translate-y-[50%] !left-[50%] !-translate-x-[50%]' : 'object-cover'}`}
                  />
                </div>
              }
            </Link >
          </div >

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
        </div>}

      {!isShowcaseUpdating && renderCommentSection(isFullView, file ?? ({} as Showcase), currentUser)}
    </div >
  );
};

export default Showcase;
