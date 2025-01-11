"use client";
import Image from "next/image";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Earth, LockKeyhole, MessageCircle } from "lucide-react";
import { useFileStore } from "~/store";
import UpdateFileView from "./UpdateFileView";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatNumber } from "~/utils/utils";
import { Card, CardContent } from "~/components/ui/card";
import { type User } from "~/types/types";
import CommentInput from "./CommentInput";
import LikeButton from "./LikeButton";
import Comments from "./Comments";

dayjs.extend(relativeTime);
const FileModalView: React.FC<{
  fileId: string;
  user: User | undefined | null;
}> = ({ fileId, user }) => {
  const { isUpdating } = useFileStore();
  const { data: file } = api.file.getFileById.useQuery({ id: fileId });

  const { data: allComments } = api.comment.getAllComments.useQuery({
    id: file?.commentsInfo?.map((comment) => comment.id) ?? [],
  });
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
      <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-4 lg:max-w-4xl">
        {file.fileType?.includes("video") ? (
          <Video url={file.url} className="h-auto w-full rounded-lg" />
        ) : (
          <div className="aspect-w-16 aspect-h-9 relative h-auto w-full">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <Image
                src={file.url}
                alt={`One of ${file.user.name}'s images`}
                fill
                className="h-full w-full rounded-md object-contain"
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
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <MessageCircle size={22} />
            </Button>
            <p>{formatNumber(file.comments)}</p>
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
      {file.filePrivacy === "public" && (
        <Card className="sticky bottom-0">
          <CardContent className="p-2">
            <CommentInput fileId={file.id} />
          </CardContent>
        </Card>
      )}
    </section>
  ) : (
    file && (
      <UpdateFileView
        file={file}
        username={file.user.name}
        imageWanted={true}
      />
    )
  );
};

export default FileModalView;
