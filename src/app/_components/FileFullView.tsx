"use client";
import {
  CalendarIcon,
  ChevronLeft,
  Earth,
  LockKeyhole,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import type { Showcase, User } from "~/types/types";
import Image from "next/legacy/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import dayjs from "dayjs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { formatNumber, getInitials } from "~/utils/utils";
import FileOptions from "./FileOptions";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useFileStore } from "~/store";
import UpdateFileView from "./UpdateFileView";
import LikeButton from "./LikeButton";
import { Card, CardContent } from "~/components/ui/card";
import CommentInput from "./CommentInput";
import Comments from "./Comments";
import { api } from "~/trpc/react";

dayjs.extend(relativeTime);

const FileFullView: React.FC<{
  user: User | undefined | null;
  file: Showcase;
  gallerySlug?: string;
}> = ({ user, file, gallerySlug }) => {
  const router = useRouter();
  const { isUpdating } = useFileStore();
  const initials = getInitials(
    file.user?.firstName ?? "",
    file.user?.lastName ?? "",
  );
  const { data: allComments } = api.comment.getAllComments.useQuery({
    id: file?.commentsInfo?.map((comment) => comment.id) ?? [],
  });
  return (
    <section className="container mx-auto flex flex-col items-start justify-around gap-4 p-4">
      <Button variant="link" className="p-0" onClick={() => router.back()}>
        <ChevronLeft size={20} />
        {gallerySlug ? "Back to Gallery" : "Back"}
      </Button>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={file.user?.image?.imageUrl ?? ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="p-0 font-bold">
                  <Link href={`/${file.user?.name}`}>@{file.user?.name}</Link>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex items-center justify-start space-x-4">
                  <Avatar>
                    <AvatarImage src={file.user?.image?.imageUrl ?? ""} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      @{file.user?.name}
                    </h4>
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
          {user?.id === file?.user?.id && (
            <FileOptions
              fileId={file.id}
              fileKey={file.fileKey}
              fileType={file.fileType}
            />
          )}
        </div>
        <div>
          <div className="relative mx-auto flex w-full max-w-full flex-col gap-4">
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

            {isUpdating ? (
              <UpdateFileView file={file} imageWanted={false} />
            ) : (
              <div className="flex flex-col gap-2">
                <h1>{file.caption}</h1>
                <div className="flex items-center gap-2">
                  {file.tags?.map((tag) => (
                    <Button key={tag} variant="link" className="p-0 font-bold">
                      <Link href={`/`}>{tag}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {!isUpdating && (
              <div className="flex items-center justify-between">
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
                    userId={user?.id}
                    likesCount={file.likesInfo?.length}
                    fileLikesInfo={file.likesInfo}
                    likedUsers={file.likedUsers}
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent"
                    >
                      <MessageCircle size={22} />
                    </Button>
                    <p>{formatNumber(file.comments)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {file.filePrivacy === "public" && (
        <div className="w-full">
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
      {file.filePrivacy === "public" && !isUpdating && (
        <Card className="sticky bottom-4 w-full">
          <CardContent className="p-2">
            <CommentInput fileId={file.id} />
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default FileFullView;
