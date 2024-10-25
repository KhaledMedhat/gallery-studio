import { Ellipsis, LoaderCircle } from "lucide-react";
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

const FileOptions: React.FC<{
  handleOpenModalChange?: () => void;
  fileId: string | null;
  fileKey: string | null;
}> = ({ fileId, fileKey, handleOpenModalChange }) => {
  const { setIsUpdating, isUpdating, isUpdatingPending } = useFileStore();
  const utils = api.useUtils();
  const { mutate: deleteFile, isPending: isFileDeleting } =
    api.file.deleteFile.useMutation({
      onSuccess: () => {
        toast({
          title: "Deleted Successfully.",
          description: `Images has been deleted successfully.`,
        });
        if (handleOpenModalChange) handleOpenModalChange()
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
          <Ellipsis size={30} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <Button
              onClick={() => {
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
                if (fileId) {
                  deleteFile({ id: [fileId] });
                  if (fileKey) await deleteFileOnServer(fileKey);
                }
              }}
              variant="ghost"
              className="text-destructive hover:bg-transparent hover:text-[#d33939]"
            >
              {isFileDeleting ? (
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
      <Button type="submit" form="update-form" disabled={isUpdatingPending}>
        {isUpdatingPending ? (
          <LoaderCircle size={25} className="animate-spin" />
        ) : (
          "Save"
        )}
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          setIsUpdating(false);
        }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default FileOptions;
