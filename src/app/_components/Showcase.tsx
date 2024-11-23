import dayjs from "dayjs"
import { CalendarIcon, Earth, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent } from "~/components/ui/card"
import type { User, Showcase } from "~/types/types"
import { formatNumber, getInitials } from "~/utils/utils"
import Video from "./Video"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { Button } from "~/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card"
import { api } from "~/trpc/react"
import { useTheme } from "next-themes"
import Image from "next/legacy/image"
import Link from "next/link"
import { useFileStore } from "~/store"
import CommentInput from "./CommentInput"
const Showcase: React.FC<{ file: Showcase, user: User | undefined | null }> = ({ file, user }) => {
    const { setIsCommenting } = useFileStore()
    const theme = useTheme()
    const utils = api.useUtils();
    const { mutate: likeFile } = api.file.likeFile.useMutation({
        onSuccess: () => {
            void utils.file.getShowcaseFiles.invalidate();
        },
    })
    const { mutate: unlikeFile } = api.file.unlikeFile.useMutation({
        onSuccess: () => {
            void utils.file.getShowcaseFiles.invalidate();
        },
    })
    return (
        <div key={file.id} className="flex flex-col items-center gap-2">
            <div className="flex self-start gap-2">
                <Avatar>
                    <AvatarImage src={file.user?.image ?? ""} />
                    <AvatarFallback>{getInitials(file.user?.name ?? "")}</AvatarFallback>
                </Avatar>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="link" className="p-0 font-bold">
                            <Link href={`/${file?.user?.id}`} >
                                @{file.user?.name}
                            </Link>
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex items-center justify-start space-x-4">
                            <Avatar>
                                <AvatarImage src={file.user?.image ?? ""} />
                                <AvatarFallback>{getInitials(file.user?.name ?? "")}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">@{file.user?.name}</h4>
                                <p className="text-sm">{file.user?.bio ? `${file.user?.bio}.` : ""}</p>
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

            <div className="w-full flex flex-col gap-2">
                <p>{file.caption}</p>
                <p>{file.tags}</p>
                <Link href={`/showcases/${file.id}`} onClick={() => setIsCommenting(true)}>
                    {file.fileType?.includes("video") ? (
                        <Video url={file.url} className="rounded-lg xl:h-[752px]" />
                    ) : (
                        <div className="aspect-w-2 aspect-h-1 h-auto w-full">
                            <AspectRatio ratio={16 / 9} className="bg-muted ">
                                <Image
                                    priority
                                    src={file.url}
                                    alt={`One of ${file.user?.name}'s images`}
                                    layout="fill"
                                    className="object-contain rounded-md h-full w-full"
                                />
                            </AspectRatio>
                        </div>

                    )}
                </Link>
            </div>

            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-accent-foreground">
                        {dayjs(file.createdAt).fromNow()}
                    </p>
                    <span className="block h-1 w-1 rounded-full bg-accent-foreground"></span>
                    <Earth size={16} className="text-accent-foreground" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Button variant='ghost' onClick={() => {
                                    if (file?.likesInfo?.find(like => like.userId === user?.id)) {
                                        unlikeFile({ id: file.id })
                                    } else {
                                        likeFile({ id: file.id })

                                    }
                                }}
                                    className="p-0 hover:bg-transparent"
                                >
                                    <Heart size={22} fill={file?.likesInfo?.find(like => like.userId === user?.id) ? "#FF0000" : theme.resolvedTheme === 'dark' ? "#171717" : "#FFFFFF"} color={file?.likesInfo?.find(like => like.userId === user?.id) && "#FF0000"} />
                                </Button>
                            </HoverCardTrigger>
                            {file.likedUsers?.length > 0 &&
                                <HoverCardContent className="w-fit p-3">
                                    {file.likedUsers?.map((liker) => (
                                        <p className="text-xs" key={liker.id}>{liker.name}</p>
                                    ))}
                                </HoverCardContent>
                            }
                        </HoverCard>

                        <p>
                            {formatNumber(file.likes)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant='ghost' className="p-0 hover:bg-transparent" onClick={() => setIsCommenting(true)}>
                            <Link href={`/showcases/${file.id}`} >
                                <MessageCircle size={22} />
                            </Link>
                        </Button>
                        <p>
                            {formatNumber(file.comments)}
                        </p>
                    </div>
                </div>
            </div>
            <Card className="w-full">
                <CardContent className="p-2">
                    {file?.commentsInfo && file.commentsInfo.length > 0 &&
                        <div className="p-2 flex flex-col gap-2">
                            {file.commentsInfo.slice(0, 2).map((comment) => (
                                <div key={comment.id} className="flex flex-col items-start">
                                    <div className="flex self-start items-center gap-2">
                                        <Avatar className="h-8 w-8" >
                                            <AvatarImage src={comment.user?.image ?? ""} />
                                            <AvatarFallback>{getInitials(comment.user?.name ?? "")}</AvatarFallback>
                                        </Avatar>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <Button variant="link" className="p-0 font-bold">
                                                    <Link href={`/${comment?.user?.id}`} >
                                                        @{comment.user?.name}
                                                    </Link>

                                                </Button>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80">
                                                <div className="flex items-center justify-start space-x-4">
                                                    <Avatar>
                                                        <AvatarImage src={comment.user?.image ?? ""} />
                                                        <AvatarFallback>{getInitials(comment.user?.name ?? "")}</AvatarFallback>
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
                    <CommentInput fileId={file.id} />
                </CardContent>
            </Card>

        </div>
    )
}

export default Showcase