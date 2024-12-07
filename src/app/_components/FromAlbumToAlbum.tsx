
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, FolderInput, LoaderCircle } from "lucide-react"
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BlurFade from "~/components/ui/blur-fade"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormField, FormItem, FormControl, FormMessage } from "~/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { toast } from "~/hooks/use-toast";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
const FromAlbumToAlbum: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
    const utils = api.useUtils()
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const albumsFormSchema = z.object({
        album: z.string({
            required_error: "Please select an album to add to.",
        }),
    });

    const albumForm = useForm<z.infer<typeof albumsFormSchema>>({
        resolver: zodResolver(albumsFormSchema),
        defaultValues: {
            album: "",
        },
    });
    const { mutate: moveFromAlbumToAlbum, isPending: isMovePending } = api.album.moveFromAlbumToAlbum.useMutation({
        onSuccess: () => {
            void utils.file.getAlbumFiles.invalidate()
            setIsDialogOpen(false)
            toast({
                title: "Moved Successfully.",
                description: `Images has been moved to ${albumForm.getValues("album")} album successfully.`,
            })
        },
    })

    const { data: allAlbums } = api.album.getAlbums.useQuery({ id: gallerySlug });
    const param = useParams()
    const { data: currentAlbum } = api.album.getAlbumById.useQuery({ id: Number(param.albumId) })
    const albums = allAlbums?.filter(album => album.name !== currentAlbum?.name)

    const { selectedFiles } = useFileStore();
    const onChooseAlbumSubmit = (albumData: z.infer<typeof albumsFormSchema>) => {
        const filesIds = selectedFiles.map((file) => file.id);
        moveFromAlbumToAlbum({
            id: filesIds,
            toAlbumTitle: albumData.album,
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="ghost">
                                <BlurFade delay={0} inView yOffset={0}>
                                    <FolderInput size={20} />
                                </BlurFade>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Move to another album</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent
                className="flex flex-col max-w-2xl"
            >
                <DialogHeader>
                    <DialogTitle>Move to another album</DialogTitle>
                    <DialogDescription>Move selected showcases to another album </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center gap-8 w-full">
                    <div className="flex flex-col items-center gap-10 w-full">
                        {currentAlbum?.name}
                    </div>
                    <ArrowRight size={20} className="w-1/2" />
                    <div className="flex flex-col items-center gap-2 w-full">
                        <Form {...albumForm}>
                            <form
                                id="move-from-to-album"
                                onSubmit={albumForm.handleSubmit(onChooseAlbumSubmit)}
                                className="w-full space-y-6"
                            >
                                <FormField
                                    control={albumForm.control}
                                    name="album"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an album to add to" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {albums?.map((album) => (
                                                        <SelectItem
                                                            key={album.id}
                                                            value={album.name}
                                                        >
                                                            {album.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="move-from-to-album"
                        disabled={isMovePending}
                    >
                        {isMovePending ? (
                            <LoaderCircle size={20} className="animate-spin" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}

export default FromAlbumToAlbum