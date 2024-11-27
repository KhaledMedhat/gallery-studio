import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react";
import { formatNumber } from "~/utils/utils";

const LikeButton: React.FC<{ fileId: string, userId: string | undefined, fileLikes: number | undefined, fileLikesInfo: { liked: boolean, userId: string }[] | null }> = ({ fileId, userId, fileLikes, fileLikesInfo }) => {
    const theme = useTheme()
    const utils = api.useUtils();
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
    const findUserLikedFile = fileLikesInfo?.find(like => like.userId === userId)
    return (
        <div className="flex items-center gap-1">
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
            <p>
                {formatNumber(fileLikes!)}
            </p>
        </div>
    )
}

export default LikeButton