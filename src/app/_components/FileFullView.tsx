'use client'
import { CalendarIcon, ChevronLeft, Earth, LockKeyhole } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import type { fileType, User } from "~/types/types"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import dayjs from "dayjs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card"
import { getInitials } from "~/utils/utils"
import FileOptions from "./FileOptions"
import Video from "./Video"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link"
import { useFileStore } from "~/store"
import UpdateFileView from "./UpdateFileView"

dayjs.extend(relativeTime);

const FileFullView: React.FC<{ user: User | undefined, file: fileType, gallerySlug: string }> = ({ user, file, gallerySlug }) => {
    const router = useRouter()
    const { isUpdating } = useFileStore();

    const initials = getInitials(user?.name ?? "");
    return (
        <section className="container mx-auto flex flex-col items-start gap-4 justify-around p-4">
            <Button variant='link' className="p-0" onClick={() => router.push(`/galleries/${gallerySlug}`)}>
                <ChevronLeft size={20} className="mr-2" />Back to Gallery
            </Button>
            <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user?.image ?? ""} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Button variant="link" className="p-0 font-bold">
                                    @{user?.name}
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="flex items-center justify-start space-x-4">
                                    <Avatar>
                                        <AvatarImage src={user?.image ?? ""} />
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">@{user?.name}</h4>
                                        <p className="text-sm">{user?.bio ? `${user?.bio}.` : ""}</p>
                                        <div className="flex items-center pt-2">
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                            <span className="text-xs text-muted-foreground">
                                                Joined {dayjs(user?.createdAt).format("MMMM")}{" "}
                                                {dayjs(user?.createdAt).format("YYYY")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>

                    <FileOptions fileId={file.id} fileKey={file.fileKey} />
                </div>
                <div>
                    <div className="relative mx-auto flex w-full max-w-full flex-col gap-4">
                        {file.fileType?.includes("video") ? (
                            <Video url={file.url} className="rounded-lg xl:h-[752px]" />
                        ) : (
                            <div className="aspect-w-2 aspect-h-1 relative h-auto w-full">
                                <AspectRatio ratio={2 / 1} className="bg-muted">
                                    <Image
                                        src={file.url}
                                        alt={`One of ${user?.name}'s images`}
                                        fill
                                        className="h-full xl:h-[752px] w-full rounded-md object-cover"
                                    />
                                </AspectRatio>
                            </div>
                        )}

                        {isUpdating ? <UpdateFileView file={file} imageWanted={false} /> : <div className="flex flex-col gap-2">
                            <h1>{file.caption}</h1>
                            <div className="flex items-center gap-2">
                                {file.tags?.map((tag) => (
                                    <Button key={tag} variant='link' className="p-0 font-bold">
                                        <Link href={`/`}>
                                            {tag}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>}
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-accent-foreground">
                                {dayjs(file.createdAt).fromNow()}
                            </p>
                            <span className="block h-1 w-1 rounded-full bg-accent-foreground"></span>
                            {file.filePrivacy === 'private' ? <LockKeyhole size={16} className="text-accent-foreground" /> : <Earth size={16} className="text-accent-foreground" />}
                        </div>


                    </div>
                </div>
            </div>
        </section>
    )
}

export default FileFullView