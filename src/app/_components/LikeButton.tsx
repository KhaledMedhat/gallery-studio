import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { api } from "~/trpc/react";
import type { LikesInfo, User } from "~/types/types";
import { formatNumber } from "~/utils/utils";

const LikeButton: React.FC<{
  commentId?: string;
  commentLikesInfo?: LikesInfo[] | null;
  likedUsers: User[] | undefined;
  fileId?: string;
  userId: string | undefined;
  likesCount: number | undefined;
  fileLikesInfo?: LikesInfo[] | null;
}> = ({
  likedUsers,
  fileId,
  userId,
  likesCount,
  fileLikesInfo,
  commentLikesInfo,
  commentId,
}) => {
  const theme = useTheme();
  const utils = api.useUtils();
  const { mutate: likeFile, isPending: isLikePending } =
    api.file.likeFile.useMutation({
      onSuccess: () => {
        void utils.file.getFileById.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
      },
    });
  const { mutate: unlikeFile, isPending: isUnlikePending } =
    api.file.unlikeFile.useMutation({
      onSuccess: () => {
        void utils.file.getFileById.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
      },
    });

  const { mutate: likeComment, isPending: isCommentLikePending } =
    api.comment.likeComment.useMutation({
      onSuccess: () => {
        void utils.file.getFileById.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
      },
    });
  const { mutate: unlikeComment, isPending: isCommentUnlikePending } =
    api.comment.unlikeComment.useMutation({
      onSuccess: () => {
        void utils.file.getFileById.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
      },
    });
  const findUserLikedFile = fileLikesInfo?.find(
    (like) => like.userId === userId,
  );
  const findUserLikedComment = commentLikesInfo?.find(
    (like) => like.userId === userId,
  );
  const findUsersLiked = findUserLikedComment ?? findUserLikedFile;
  return (
    <div className="flex items-center gap-1">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            disabled={
              isLikePending ||
              isUnlikePending ||
              isCommentLikePending ||
              isCommentUnlikePending
            }
            variant="ghost"
            onClick={() => {
              if (fileId) {
                if (findUserLikedFile) {
                  unlikeFile({ id: fileId });
                } else {
                  likeFile({ id: fileId });
                }
              } else {
                if (commentId) {
                  if (findUserLikedComment) {
                    unlikeComment({ id: commentId });
                  } else {
                    likeComment({ id: commentId });
                  }
                }
              }
            }}
            className="h-fit p-0 hover:bg-transparent"
          >
            <Heart
              size={22}
              fill={
                findUsersLiked
                  ? "#FF0000"
                  : theme.resolvedTheme === "dark"
                    ? "#171717"
                    : "#FFFFFF"
              }
              color={findUsersLiked && "#FF0000"}
            />
          </Button>
        </HoverCardTrigger>
        {likedUsers && likedUsers?.length > 0 && (
          <HoverCardContent className="w-fit p-3">
            {likedUsers?.map((liker) => (
              <p className="text-xs" key={liker.id}>
                {liker.name}
              </p>
            ))}
          </HoverCardContent>
        )}
      </HoverCard>
      <p className="h-fit">{formatNumber(likesCount!)}</p>
    </div>
  );
};

export default LikeButton;
