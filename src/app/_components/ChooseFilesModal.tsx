'use client'
import { Earth, Images, LoaderCircle, LockKeyhole } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import BlurFade from "~/components/ui/blur-fade"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { api } from "~/trpc/react"
import Video from "./Video"
import Image from "next/legacy/image"
import { Checkbox } from "~/components/ui/checkbox"
import { useState } from "react"
import { toast } from "~/hooks/use-toast"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AddFileButton from "./AddFileButton";

const ChooseFilesModal: React.FC<{ isInsideAlbum?: boolean }> = ({ isInsideAlbum }) => {
    const param = useParams()
    const { data: files } = api.file.getFiles.useQuery()
    const { data: albumFiles } = api.file.getAlbumFiles.useQuery({ id: Number(param.albumId) })
    const isTheFileInAlbum = (id: string) => {
        return albumFiles?.some((file) => file.id === id)
    }
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const utils = api.useUtils();
    const { mutate: addToExistedAlbum, isPending } = api.album.addToAlbum.useMutation({
        onSuccess: () => {
            toast({
                title: "Added Successfully.",
                description: `Images has been added successfully.`,
            });
            setSelectedFiles([]);
            void utils.file.getAlbumFiles.invalidate();
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Uh oh! Something went wrong. Please try again.`,
            });
        },
    });
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={isInsideAlbum ? 'outline' : 'ghost'}>
                    {isInsideAlbum ? "Add to album" : <Images className={`${albumFiles?.length === 0 && "animate-bounce"}`} size={20} />}

                </Button>
            </DialogTrigger>
            <DialogContent className="h-fit max-h-full overflow-y-auto">
                <VisuallyHidden.Root>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                </VisuallyHidden.Root>
                <Tabs defaultValue="Albums" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="choose-from-gallery">Choose from your gallery</TabsTrigger>
                        <TabsTrigger value="add-file">Add</TabsTrigger>
                    </TabsList>
                    <TabsContent value="choose-from-gallery">
                        <Card className="max-h-[80vh] w-full overflow-y-auto">
                            <CardHeader>
                                <CardTitle>Add from your gallery</CardTitle>
                                <CardDescription>
                                    You can add images, videos even GIF from your gallery into this album by selecting them.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-4 p-6 flex-wrap justify-center">
                                {files?.map((file, idx) => (
                                    <BlurFade key={file.id} delay={0.25 + Number(idx) * 0.05} inView>
                                        <div className={`group flex flex-col gap-1 relative h-full w-full overflow-hidden rounded-lg`}>
                                            <Checkbox
                                                disabled={isTheFileInAlbum(file.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedFiles((prev) => [...prev, file.id]);
                                                    } else {
                                                        setSelectedFiles((prev) => prev.filter(id => id !== file.id))
                                                    }
                                                }}
                                                className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted  `}
                                            />
                                            <div className="relative h-full w-full">
                                                <div className="w-[240px] h-[300px]">

                                                    {file.fileType?.includes('image') ?
                                                        <Image
                                                            priority
                                                            src={file.url}
                                                            alt={`Gallery image ${file.id}`}
                                                            layout="fill"
                                                            className={`h-full w-full shadow rounded-md object-cover transition-transform duration-300 hover:scale-105`}

                                                        />
                                                        :
                                                        <Video url={file.url} showInitialPlayButton={false} />
                                                    }

                                                </div>
                                            </div>
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
                                    </BlurFade>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full"
                                    disabled={isPending || selectedFiles.length === 0}
                                    onClick={() => addToExistedAlbum({ id: selectedFiles, albumId: Number(param.albumId) })}>
                                    {isPending ? (
                                        <LoaderCircle size={20} className="animate-spin" />
                                    ) : (
                                        'Add'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="add-file">
                        <AddFileButton isTabs={true} gallerySlug={param.id as string} albumId={param.albumId as string} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default ChooseFilesModal