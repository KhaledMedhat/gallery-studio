import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { api } from "~/trpc/react";
import { type User } from "~/types/types";
import { formatNumber } from "~/utils/utils";

const LikeButton: React.FC<{ likedUsers: User[] | undefined, fileId: string, userId: string | undefined, fileLikes: number | undefined, fileLikesInfo: { liked: boolean, userId: string }[] | null }> = ({ likedUsers, fileId, userId, fileLikes, fileLikesInfo }) => {
    const theme = useTheme()
    const utils = api.useUtils();
    const { mutate: likeFile } = api.file.likeFile.useMutation({
        onSuccess: () => {
            void utils.file.getFileById.invalidate();
            void utils.file.getShowcaseFiles.invalidate();
        },
    })
    const { mutate: unlikeFile } = api.file.unlikeFile.useMutation({
        onSuccess: () => {
            void utils.file.getFileById.invalidate();
            void utils.file.getShowcaseFiles.invalidate();
        },
    })
    const findUserLikedFile = fileLikesInfo?.find(like => like.userId === userId)
    return (
        <div className="flex items-center gap-1">
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant='ghost' onClick={() => {
                        if (findUserLikedFile) {
                            unlikeFile({ id: fileId })
                        } else {
                            likeFile({ id: fileId })

                        }
                    }}
                        className="p-0 hover:bg-transparent"
                    >
                        <Heart size={22} fill={findUserLikedFile ? "#FF0000" : theme.resolvedTheme === 'dark' ? "#171717" : "#FFFFFF"} color={findUserLikedFile && "#FF0000"} />
                    </Button>
                </HoverCardTrigger>
                {likedUsers && likedUsers?.length > 0 &&
                    <HoverCardContent className="w-fit p-3">
                        {likedUsers?.map((liker) => (
                            <p className="text-xs" key={liker.id}>{liker.name}</p>
                        ))}
                    </HoverCardContent>
                }
            </HoverCard>
            <p>
                {formatNumber(fileLikes!)}
            </p>
        </div>
    )
}

export default LikeButton