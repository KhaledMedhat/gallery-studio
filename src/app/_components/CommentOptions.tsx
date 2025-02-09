import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import CustomDrawer from "./CustomDrawer"
import { Ellipsis } from "lucide-react"
import { DrawerEnum } from "~/types/types"
import { api } from "~/trpc/react"

const CommentOptions: React.FC<{ commentId: string, commentContent: string }> = ({ commentId, commentContent }) => {
    const utils = api.useUtils();
    const { mutate: deleteComment, isPending: isDeletingComment } =
        api.comment.deleteComment.useMutation({
            onSuccess: () => {
                void utils.file.getFileById.invalidate();
                void utils.file.getShowcaseFiles.invalidate();
            },
        });
    return (
        <DropdownMenu
        // modal={true}
        // open={openDropDown}
        // onOpenChange={setOpenDropDown}
        >
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-fit p-0 hover:bg-transparent"
                >
                    <Ellipsis size={30} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit">
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        asChild
                        className="p-0 hover:outline-none"
                    >
                        <CustomDrawer
                            drawerAppearance={DrawerEnum.UPDATE_COMMENT}
                            btnTitle={"Edit"}
                            drawerTitle={"Update comment"}
                            drawerDescription={"Update your comment."}
                            originalComment={commentContent}
                            commentId={commentId}
                        // setOpenDropDown={setOpenDropDown}
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-0 text-destructive hover:bg-transparent hover:outline-none">
                        <Button
                            onClick={() =>
                                deleteComment({ id: commentId })
                            }
                            variant="ghost"
                            className="w-full hover:text-[#d33939]"
                            disabled={isDeletingComment}
                        >
                            Delete
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default CommentOptions