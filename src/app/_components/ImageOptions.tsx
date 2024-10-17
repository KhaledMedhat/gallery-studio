import { Ellipsis } from "lucide-react";
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

const ImageOptions: React.FC<{ fileId: string; fileKey: string | null }> = ({
  fileId,
  fileKey,
}) => {
  const utils = api.useUtils();
  const { mutate: deleteImage } = api.file.deleteFile.useMutation({
    onSuccess: () => {
      toast({
        title: "Deleted Successfully.",
        description: `Images ${deleteImage.name} has been deleted successfully.`,
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          <Ellipsis size={30} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-0">
            <Button variant="ghost" className="hover:bg-transparent">
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Button
              onClick={async () => {
                deleteImage({ id: [fileId] });
                if (fileKey) await deleteFileOnServer(fileKey);
              }}
              variant="ghost"
              className="text-destructive hover:bg-transparent hover:text-[#d33939]"
            >
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImageOptions;
