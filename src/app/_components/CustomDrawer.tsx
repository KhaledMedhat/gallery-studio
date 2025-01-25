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
import { DrawerEnum } from "~/types/types";
import CommentInput from "./CommentInput";
import { useState } from "react";

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
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
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
            <CommentInput
              originalComment={originalComment}
              commentId={commentId}
              setOpen={setOpen}
              setOpenDropDown={setOpenDropDown}
            />
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
