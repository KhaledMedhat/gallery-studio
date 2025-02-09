import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import FeedbackForm from "./FeedbackForm";
import { DrawerEnum, ElementType, MentionType } from "~/types/types";
import { useEffect, useState } from "react";
import MentionInput from "./MentionInput";

const CustomDrawer: React.FC<{
  drawerAppearance: DrawerEnum;
  btnTitle: string | React.ReactNode;
  drawerTitle: string;
  drawerDescription: string;
  originalComment?: string;
  commentId?: string;
  setOpenDropDown?: (open: boolean) => void;
}> = ({
  drawerTitle,
  btnTitle,
  drawerDescription,
  drawerAppearance,
  originalComment,
  commentId,
  setOpenDropDown,
}) => {
    const [open, setOpen] = useState<boolean>(false);
    // useEffect(() => {

    // }, [setOpenDropDown])
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${typeof btnTitle !== "string" && "rounded-full"}`}
            variant={
              drawerAppearance === DrawerEnum.ADD_FEEDBACK ? "outline" : "ghost"
            }
          >
            {btnTitle}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="p-0 py-4">
              <DrawerTitle>{drawerTitle}</DrawerTitle>
              <DrawerDescription>{drawerDescription}</DrawerDescription>
            </DrawerHeader>
            {drawerAppearance === DrawerEnum.ADD_FEEDBACK && <FeedbackForm />}
            {drawerAppearance === DrawerEnum.UPDATE_COMMENT && (
              <MentionInput
                originalComment={originalComment}
                commentId={commentId}
                setOpen={setOpen}
                // setOpenDropDown={setOpenDropDown}
                mentionType={MentionType.FOLLOWINGS}
                inputType={ElementType.INPUT} />
            )}
            <DrawerFooter className="p-0 py-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

export default CustomDrawer;
