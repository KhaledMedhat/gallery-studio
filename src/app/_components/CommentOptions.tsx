import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import CustomDrawer from "./CustomDrawer"
import { Ellipsis } from "lucide-react"
import { DrawerEnum, type User } from "~/types/types"
import { Drawer, DrawerTrigger } from "~/components/ui/drawer"
import DeleteButton from "./DeleteButton"
import * as React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

const CommentOptions: React.FC<{ commentId: string, currentUser: User | undefined | null, commentContent: string }> = ({ commentId, currentUser, commentContent }) => {
    const param = useParams()
    const [dropdownModality, setDropdownModality] = useState<boolean>(false)
    useEffect(() => {
        if (param.fileId) {
            setDropdownModality(true)
        } else {
            setDropdownModality(false)
        }
    }, [param.fileId])
    return (
        <Drawer>
            <DropdownMenu modal={dropdownModality}>
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
                            className="p-0 hover:outline-none"
                        >
                            <DrawerTrigger asChild>
                                <Button variant="ghost" className="w-full">
                                    Edit
                                </Button>
                            </DrawerTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem className=" p-0 " asChild>
                            <DeleteButton commentId={commentId} />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <CustomDrawer
                currentUser={currentUser}
                drawerAppearance={DrawerEnum.UPDATE_COMMENT}
                drawerTitle={"Update comment"}
                drawerDescription={"Update your comment."}
                originalComment={commentContent}
                commentId={commentId}
            />

        </Drawer>
    )
}
export default CommentOptions