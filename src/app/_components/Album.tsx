'use client'
import { LockKeyhole, Earth } from "lucide-react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import BlurFade from "~/components/ui/blur-fade";
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import Link from "next/link";
import Image from "next/image";
import Video from "./Video";
import { useFileStore } from "~/store";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import EmptyPage from "./EmptyPage";
import { Button } from "~/components/ui/button";
import DeleteButton from "./DeleteButton";
import { useParams } from "next/navigation";

const Album: React.FC<{ id: string }> = ({ id }) => {
    const param = useParams()
    const { data: albumFiles } = api.file.getAlbumFiles.useQuery({ id: Number(id) })
    const [loadedFiles, setLoadedFiles] = useState<Set<number>>(new Set());
    const handleImageLoad = (id: number) => {
        setLoadedFiles((prev) => new Set(prev).add(id));
    };
    const { setSelectedFiles, removeSelectedFiles, selectedFiles, isSelecting, setIsSelecting, setSelectedFilesToEmpty } =
        useFileStore();
    const isFileSelected = (fileId: string) => {
        return selectedFiles.some((file) => file.id === fileId);
    }
    function foundedFileInSelectedFiles(id: string) {
        const isFoundedFile = selectedFiles.find((file) => file.id === id);
        return isFoundedFile;
    }
    if (albumFiles?.length === 0) return <EmptyPage isInsideAlbum={true} />
    return (
        <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
                {selectedFiles.length > 0 &&
                    <div className="flex gap-2 items-center xl:hidden">
                        <DeleteButton />
                    </div>}
                <Button onClick={() => {
                    if (isSelecting) {
                        setSelectedFilesToEmpty()
                        setIsSelecting()
                    } else {
                        setIsSelecting()

                    }
                }} className="xl:hidden " variant="outline">
                    {isSelecting ? 'Cancel' : 'Select'}
                </Button>

            </div>
            <div className="flex items-center gap-4 justify-center flex-wrap">
                {albumFiles?.map((file, idx) => (
                    <BlurFade key={file.id} delay={0.25 + Number(idx) * 0.05} inView>
                        <div className={`group flex flex-col gap-1 relative h-full w-full overflow-hidden rounded-lg`}>
                            <Checkbox
                                checked={isFileSelected(file.id)}
                                onClick={(e) => e.stopPropagation()}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setSelectedFiles({
                                            id: file.id,
                                            fileKey: file.fileKey ?? "",
                                        });
                                    } else {
                                        removeSelectedFiles({
                                            id: file.id,
                                            fileKey: file.fileKey ?? "",
                                        });
                                    }
                                }}
                                className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted ${foundedFileInSelectedFiles(file.id) ? "flex" : "hidden"
                                    } group-hover:flex  ${isSelecting && 'flex'}  `}
                            />
                            <Link href={`/galleries/${String(param.id)}/images/${file.id}`}>
                                <div className="relative h-full w-full">
                                    <div className="h-full w-[300px]">

                                        {file.fileType?.includes('image') ?
                                            <AspectRatio ratio={1 / 1}>
                                                <Image
                                                    priority
                                                    src={file.url}
                                                    alt={`Gallery image ${file.id}`}
                                                    layout="fill"
                                                    className={`h-full w-full cursor-pointer shadow rounded-md object-cover transition-transform duration-300 hover:scale-105 ${loadedFiles.has(Number(file.id))
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                        }`}
                                                    onLoadingComplete={() =>
                                                        handleImageLoad(Number(file.id))
                                                    }
                                                />
                                            </AspectRatio>
                                            :
                                            <Video url={file.url} showInitialPlayButton={false} />
                                        }

                                    </div>

                                    {!loadedFiles.has(Number(file.id)) && (
                                        <Skeleton className="h-full w-full rounded-lg" />
                                    )}
                                </div>
                            </Link>
                            <div className="w-full flex items-center justify-between px-2">
                                <div>
                                    {file.fileType?.includes("image") ? (
                                        <Badge>
                                            {file.fileType.includes("gif") ? "GIF" : "Image"}
                                        </Badge>
                                    ) : (
                                        <Badge>Video</Badge>
                                    )}
                                </div>
                                <div>
                                    {file.filePrivacy === "private" ? (
                                        <LockKeyhole size={14} />
                                    ) : (
                                        <Earth size={14} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </BlurFade>))}
            </div>
        </div>)
};

export default Album;