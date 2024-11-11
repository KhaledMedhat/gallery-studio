"use client";
import Image from "next/image";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Earth, Heart, LockKeyhole, MessageCircle } from "lucide-react";
import { useFileStore } from "~/store";
import UpdateFileView from "./UpdateFileView";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatNumber, getInitials } from "~/utils/utils";
import { useTheme } from "next-themes";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { type User } from "~/types/types";

dayjs.extend(relativeTime);
const FileModalView: React.FC<{
  fileId: string;
  user: User | undefined | null;
}> = ({ fileId, user }) => {
  const utils = api.useUtils();
  const theme = useTheme()
  const { isUpdating, isCommenting } = useFileStore();
  const { data: file } = api.file.getFileById.useQuery({ id: fileId });
  const { mutate: likeFile } = api.file.likeFile.useMutation({
    onSuccess: () => {
      void utils.file.getFileById.invalidate();
    },
  })
  const { mutate: unlikeFile } = api.file.unlikeFile.useMutation({
    onSuccess: () => {
      void utils.file.getFileById.invalidate();
    },
  })
  const findUserLikedFile = file?.likesInfo?.find(like => like.userId === user?.id)
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
          <div className="flex items-center gap-1">
            <Button variant='ghost' onClick={() => {
              if (findUserLikedFile) {
                unlikeFile({ id: file.id })
              } else {
                likeFile({ id: file.id })

              }
            }}
              className="p-0 hover:bg-transparent"
            >
              <Heart size={22} fill={findUserLikedFile ? "#FF0000" : theme.resolvedTheme === 'dark' ? "#171717" : "#FFFFFF"} color={findUserLikedFile && "#FF0000"} />
            </Button>
            <p>
              {formatNumber(file.likes)}
            </p>
          </div>
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
      <Card>
        <CardContent className="flex flex-col gap-4 justify-center p-4">
          {isCommenting &&
            file.commentsInfo.map((comment) => (
              <div key={comment.id} className="flex items-center gap-2">
                <div>
                  <Avatar>
                    <AvatarImage src={comment.user.image ?? ""} alt={comment.user.name ?? "Avatar"} />
                    <AvatarFallback>{getInitials(comment.user.name ?? "")}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p>{comment.user.name}</p>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          }
        </CardContent>
      </Card>

    </section>
  ) : (
    file && <UpdateFileView file={file} userName={file.user.name} imageWanted={true} />
  );
};

export default FileModalView;
