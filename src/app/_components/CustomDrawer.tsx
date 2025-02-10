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
import MentionInput from "./MentionInput";

const CustomDrawerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="w-full rounded-full"
          variant={"outline"}
        >
          Add
        </Button>
        {children}
      </DrawerTrigger>
    </Drawer>

  )
}

const CustomDrawer: React.FC<{
  drawerAppearance: DrawerEnum;
  drawerTitle: string;
  drawerDescription: string;
  originalComment?: string;
  commentId?: string;
}> = ({
  drawerTitle,
  drawerDescription,
  drawerAppearance,
  originalComment,
  commentId,
}) => {
    return (
      drawerAppearance === DrawerEnum.ADD_FEEDBACK ?
        <CustomDrawerWrapper >
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="p-0 py-4">
                <DrawerTitle>{drawerTitle}</DrawerTitle>
                <DrawerDescription>{drawerDescription}</DrawerDescription>
              </DrawerHeader>
              <FeedbackForm />
              <DrawerFooter className="p-0 py-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </CustomDrawerWrapper>
        :
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="p-0 py-4">
              <DrawerTitle>{drawerTitle}</DrawerTitle>
              <DrawerDescription>{drawerDescription}</DrawerDescription>
            </DrawerHeader>

            <MentionInput
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
