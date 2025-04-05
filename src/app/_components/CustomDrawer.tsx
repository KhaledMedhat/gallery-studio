import { Button } from "~/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { ElementType, MentionType, type User } from "~/types/types";
import MentionInput from "./MentionInput";

const CustomDrawer: React.FC<{
  drawerTitle: string;
  currentUser: User | undefined | null;
  drawerDescription: string;
  originalComment?: string;
  commentId?: string;
}> = ({
  drawerTitle,
  currentUser,
  drawerDescription,
  originalComment,
  commentId,
}) => {
    return (
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="p-0 py-4">
            <DrawerTitle>{drawerTitle}</DrawerTitle>
            <DrawerDescription>{drawerDescription}</DrawerDescription>
          </DrawerHeader>

          <MentionInput
            currentUser={currentUser}
            originalComment={originalComment}
            commentId={commentId}
            mentionType={MentionType.FOLLOWINGS}
            inputType={ElementType.INPUT} />

          <DrawerFooter className="p-0 py-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    );
  };

export default CustomDrawer;
