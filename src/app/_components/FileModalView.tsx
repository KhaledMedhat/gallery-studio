"use client";
import Image from "next/image";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CalendarIcon, Earth, LockKeyhole, MessageCircle } from "lucide-react";
import { useFileStore } from "~/store";
import UpdateFileView from "./UpdateFileView";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatNumber, getInitials } from "~/utils/utils";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { type User } from "~/types/types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import CommentInput from "./CommentInput";
import LikeButton from "./LikeButton";
import Link from "next/link";

dayjs.extend(relativeTime);
const FileModalView: React.FC<{
  fileId: string;
  user: User | undefined | null;
}> = ({ fileId, user }) => {
  const { isUpdating } = useFileStore();
  const { data: file } = api.file.getFileById.useQuery({ id: fileId });
  return !isUpdating && file ? (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p>{file.caption}</p>
        <div className="flex items-center gap-2">
          {file.tags?.map((tag, idx) => (
            <p key={idx} className="font-bold">
              {tag}
            </p>
          ))}
        </div>
      </div>
      <div className="relative mx-auto flex w-full max-w-2xl lg:max-w-4xl flex-col gap-4">
        {file.fileType?.includes("video") ? (
          <Video url={file.url} className="rounded-lg h-auto w-full" />
        ) : (
          <div className="aspect-w-16 aspect-h-9 relative h-auto w-full">
            <AspectRatio ratio={4 / 3} className="bg-muted">
              <Image
                src={file.url}
                alt={`One of ${file.user.name}'s images`}
                fill
                className="h-full w-full rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        )}

      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-accent-foreground">
            {dayjs(file.createdAt).fromNow()}
          </p>
          <span className="block h-1 w-1 rounded-full bg-accent-foreground"></span>
          {file.filePrivacy === 'private' ? <LockKeyhole size={16} className="text-accent-foreground" /> : <Earth size={16} className="text-accent-foreground" />}
        </div>
        <div className="flex items-center gap-2">
          <LikeButton fileId={file.id} userId={user?.id} fileLikes={file.likesInfo?.length} fileLikesInfo={file.likesInfo} likedUsers={file.likedUsers} />
          <div className="flex items-center gap-1">
            <Button variant='ghost' className="p-0 hover:bg-transparent" >
              <MessageCircle size={22} />
            </Button>
            <p>
              {formatNumber(file.comments)}
            </p>
          </div>
        </div>
      </div>
      {file.filePrivacy === 'public' &&

        <div className="w-full">
          <div className="p-2">
            {file?.commentsInfo && file.commentsInfo.length > 0 &&
              <div className="p-2 flex flex-col gap-2">
                {file.commentsInfo.map((comment) => (
                  <div key={comment.id} className="flex flex-col items-start">
                    <div className="flex self-start items-center gap-2">
                      <Avatar className="h-8 w-8" >
                        <AvatarImage src={comment.user?.image ?? ""} />
                        <AvatarFallback>{getInitials(comment.user?.firstName ?? "", comment.user?.lastName ?? "")}</AvatarFallback>
                      </Avatar>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="link" className="p-0 font-bold">
                            <Link href={`/${comment.user?.name}`} >
                              @{comment.user?.name}
                            </Link>
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 fixed">
                          <div className="flex items-center justify-start space-x-4">
                            <Avatar>
                              <AvatarImage src={comment.user?.image ?? ""} />
                              <AvatarFallback>{getInitials(comment.user?.firstName ?? "", comment.user?.lastName ?? "")}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">@{comment.user?.name}</h4>
                              <p className="text-sm">{comment.user?.bio ? `${comment.user?.bio}.` : ""}</p>
                              <div className="flex items-center pt-2">
                                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                <span className="text-xs text-muted-foreground">
                                  Joined {dayjs(comment.user?.createdAt).format("MMMM")}{" "}
                                  {dayjs(comment.user?.createdAt).format("YYYY")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="pl-12">
                      <p className="">{comment.content}</p>
                      <p className="text-xs">{dayjs(comment.createdAt).fromNow(true).replace("minutes", "m")
                        .replace("minute", "m")
                        .replace("hours", "h")
                        .replace("hour", "h")
                        .replace("days", "d")
                        .replace("day", "d")
                        .replace("seconds", "s")
                        .replace("second", "s")
                        .replace("a", "1")}</p>
                    </div>
                  </div>

                ))}
              </div>
            }
          </div>
        </div>
      }
      {file.filePrivacy === 'public' &&
        <Card className="sticky bottom-0">
          <CardContent className="p-2">
            <CommentInput fileId={file.id} />
          </CardContent>
        </Card>
      }


    </section>
  ) : (
    file && <UpdateFileView file={file} username={file.user.name} imageWanted={true} />
  );
};

export default FileModalView;
