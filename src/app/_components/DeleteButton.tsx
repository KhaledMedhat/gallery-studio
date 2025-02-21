import { LoaderCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
import { deleteFileOnServer } from "../actions";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import BlurFade from "~/components/ui/blur-fade";
import { useParams, useRouter } from "next/navigation";
import { typeOfFile } from "~/utils/utils";

const DeleteButton: React.FC<{
  fileId?: string | null;
  fileKey?: string | null;
  fileType?: string | null;
  isFileModal?: boolean;
  isAlbum?: boolean;
  albumId?: number;
  commentId?: string;
  handleOpenModalChange?: () => void;
}> = ({
  fileId,
  fileKey,
  isFileModal,
  handleOpenModalChange,
  fileType,
  isAlbum,
  commentId,
  albumId,
}) => {
    const { selectedFiles, setSelectedFilesToEmpty } = useFileStore();
    const utils = api.useUtils();
    const router = useRouter();
    const param = useParams();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { mutate: deleteComment, isPending: isDeletingComment } =
      api.comment.deleteComment.useMutation({
        onMutate: () => {
          setIsDialogOpen(true);
        },
        onSuccess: () => {
          setIsDialogOpen(false);
          void utils.file.getFileById.invalidate();
          void utils.file.getShowcaseFiles.invalidate();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Deleting Comment Failed.",
            description: `Uh oh! Something went wrong. Please try again.`,
          });
        },
      });
    const { mutate: deleteFileFromAlbum, isPending: isDeletingFromAlbum } =
      api.album.deleteFileFromAlbum.useMutation({
        onMutate: () => {
          setIsDialogOpen(true);
        },
        onSuccess: () => {
          setSelectedFilesToEmpty();
          toast({
            title: "Deleted Successfully.",
            description: `${selectedFiles.length > 0 && selectedFiles.length < 2 ? typeOfFile(fileType) : "Showcases"} has been deleted from the album successfully.`,
          });
          setIsDialogOpen(false);
          void utils.file.getAlbumFiles.invalidate();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Deleting Image Failed.",
            description: `Uh oh! Something went wrong. Please try again.`,
          });
        },
      });
    const { mutate: deleteFile, isPending: isDeleting } =
      api.file.deleteFile.useMutation({
        onMutate: () => {
          setIsDialogOpen(true);
        },
        onSuccess: () => {
          setSelectedFilesToEmpty();
          toast({
            title: "Deleted Successfully.",
            description: `${selectedFiles.length > 0 && selectedFiles.length < 2 ? typeOfFile(fileType) : "Showcases"} has been deleted successfully.`,
          });
          setIsDialogOpen(false);
          if (param.id) router.push(`/galleries/${param.id as string}`);
          if (handleOpenModalChange) handleOpenModalChange();
          void utils.file.getFiles.invalidate();
          void utils.file.getShowcaseFiles.invalidate();
          if (param.albumId) void utils.file.getAlbumFiles.invalidate();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Deleting Image Failed.",
            description: `Uh oh! Something went wrong. Please try again.`,
          });
        },
      });

    const { mutate: deleteAlbum, isPending: isAlbumDeleting } =
      api.album.deleteAlbum.useMutation({
        onMutate: () => {
          setIsDialogOpen(true);
        },
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Deleted Successfully.",
            description: `Album has been deleted successfully.`,
          });
          void utils.album.getAlbums.invalidate();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Deleting Album Failed.",
            description: `Uh oh! Something went wrong. Please try again.`,
          });
        },
      });
    return (
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <BlurFade delay={0} inView yOffset={0}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full rounded-sm text-destructive hover:text-[#d33939]"
                  >
                    {isFileModal || (isAlbum && albumId) || commentId ? (
                      "Delete"
                    ) : (
                      <Trash2 size={20} className="text-destructive" />
                    )}
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
              This action cannot be undone. This will permanently remove the
              selected files from your gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting || isDeletingFromAlbum || isAlbumDeleting || isDeletingComment}
              onClick={async () => {
                if (isAlbum && albumId) {
                  deleteAlbum({ id: albumId });
                } else if (commentId) {
                  deleteComment({ id: commentId })
                } else if (param.albumId) {
                  deleteFileFromAlbum({
                    albumId: Number(param.albumId),
                    id: selectedFiles.map((file) => file.id),
                  });
                } else if (fileId && fileKey && selectedFiles.length === 0) {
                  deleteFile({ id: [fileId] });
                  await deleteFileOnServer(fileKey);
                } else {
                  deleteFile({
                    id: selectedFiles.map((file) => file.id),
                  });
                  await deleteFileOnServer(
                    selectedFiles.map((file) => file.fileKey),
                  );
                }
              }}
            >
              {isDeleting || isDeletingFromAlbum || isAlbumDeleting || isDeletingComment ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

export default DeleteButton;
