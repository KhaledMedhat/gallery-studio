import { LoaderCircle, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { ToastAction } from "~/components/ui/toast";
import { toast } from "~/hooks/use-toast";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
import { deleteFileOnServer } from "../actions";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import BlurFade from "~/components/ui/blur-fade";

const DeleteButton = () => {
    const { selectedFiles, setSelectedFilesToEmpty } = useFileStore();
    const utils = api.useUtils();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { mutate: deleteFile, isPending: isDeleting } =
        api.file.deleteFile.useMutation({
            onMutate: () => {
                setIsDialogOpen(true)
            },
            onSuccess: () => {
                setSelectedFilesToEmpty();
                toast({
                    title: "Deleted Successfully.",
                    description: `Images ${deleteFile.name} has been deleted successfully.`,
                });
                setIsDialogOpen(false)
                void utils.file.getFiles.invalidate();
                void utils.file.getAlbumFiles.invalidate();
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Deleting Image Failed.",
                    description: `Uh oh! Something went wrong. Please try again.`,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
            },
        });
    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <BlurFade delay={0} inView yOffset={0}>
                            <AlertDialogTrigger asChild >
                                <Button variant="ghost">
                                    <Trash2 size={20} className="text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                        </BlurFade>
                    </TooltipTrigger>
                    <TooltipContent>Trash</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently remove the selected files from your gallery.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={async () => {
                            deleteFile({
                                id: selectedFiles.map((file) => file.id),
                            });
                            await deleteFileOnServer(
                                selectedFiles.map((file) => file.fileKey),
                            );
                        }}>{isDeleting ? <LoaderCircle size={20} className="animate-spin" /> : "Continue"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteButton