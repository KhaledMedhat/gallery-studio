import { Ellipsis, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { deleteFileOnServer } from "../actions";
import { useFileStore } from "~/store";
import DeleteButton from "./DeleteButton";

const FileOptions: React.FC<{
  handleOpenModalChange?: () => void;
  fileId: string | null;
  fileKey: string | null;
}> = ({ fileId, fileKey, handleOpenModalChange }) => {
  const { setIsUpdating, isUpdating, isUpdatingPending } = useFileStore();
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
          <DropdownMenuItem className="p-0" asChild>
            <DeleteButton fileId={fileId} fileKey={fileKey} isFileModal={true} handleOpenModalChange={handleOpenModalChange} />
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
