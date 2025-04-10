import { Ellipsis, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useFileStore } from "~/store";
import DeleteButton from "./DeleteButton";

const FileOptions: React.FC<{
  handleOpenModalChange?: () => void;
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
  fileId: string | null;
  fileKey: string | null;
  fileType: string | null;
}> = ({ fileId, fileKey, setIsUpdating, isUpdating, handleOpenModalChange, fileType }) => {
  const { isUpdatingPending } = useFileStore();
  return !isUpdating ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          <Ellipsis size={30} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem className="w-full p-0">
            <Button
              onClick={() => {
                setIsUpdating(true)
              }}
              variant="ghost"
              className="w-full cursor-pointer"
            >
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full p-0" asChild>
            <DeleteButton
              fileType={fileType}
              fileId={fileId}
              fileKey={fileKey}
              isFileModal={true}
              handleOpenModalChange={handleOpenModalChange}
            />
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
