import { Ellipsis, EllipsisVertical, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ToastAction } from "~/components/ui/toast";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { deleteFileOnServer } from "../actions";
import { useFileStore } from "~/store";
import { useRouter } from "next/navigation";
import { isAlbumOrFile } from "~/types/types";

const ImageOptions: React.FC<{
  isAlbumUpdating?: boolean;
  albumId: number | null;
  fileId: string | null;
  fileKey: string | null;
  fileCaption: string | null;
  isAlbumOrFile: isAlbumOrFile;
}> = ({ fileId, fileKey, isAlbumOrFile, albumId, isAlbumUpdating }) => {
  const { setIsUpdating, isUpdating, isUpdatingPending } = useFileStore();
  const utils = api.useUtils();
  const router = useRouter();
  const { mutate: deleteAlbum, isPending: isAlbumDeleting } =
    api.album.deleteAlbum.useMutation({
      onSuccess: () => {
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
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
    });
  const { mutate: deleteFile, isPending: isFileDeleting } =
    api.file.deleteFile.useMutation({
      onSuccess: () => {
        toast({
          title: "Deleted Successfully.",
          description: `Images has been deleted successfully.`,
        });
        void utils.file.getFiles.invalidate();
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
  return !isUpdating ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          {isAlbumOrFile === "file" && <Ellipsis size={30} />}
          {isAlbumOrFile === "album" && <EllipsisVertical size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsUpdating(true);
              }}
              variant="ghost"
              className="hover:bg-transparent"
            >
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Button
              disabled={isFileDeleting}
              onClick={async () => {
                if (isAlbumOrFile === "file" && fileId) {
                  deleteFile({ id: [fileId] });
                  if (fileKey) await deleteFileOnServer(fileKey);
                }
                if (isAlbumOrFile === "album" && albumId) {
                  deleteAlbum({ id: albumId });
                }
              }}
              variant="ghost"
              className="text-destructive hover:bg-transparent hover:text-[#d33939]"
            >
              {isFileDeleting || isAlbumDeleting ? (
                <LoaderCircle size={25} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-2">
      <Button
        type="submit"
        form={isAlbumOrFile === "file" ? "update-form" : "update-album-form"}
        disabled={isUpdatingPending || isAlbumUpdating}
      >
        {isUpdatingPending || isAlbumUpdating ? (
          <LoaderCircle size={25} className="animate-spin" />
        ) : (
          "Save"
        )}
      </Button>
      <Button
        variant="destructive"
        onClick={(e) => {
          e.preventDefault();
          setIsUpdating(false);
        }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default ImageOptions;
