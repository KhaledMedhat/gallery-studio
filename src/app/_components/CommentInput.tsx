import { zodResolver } from "@hookform/resolvers/zod";
import { Smile, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import data from "@emoji-mart/data";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useTheme } from "next-themes";
import Picker from "@emoji-mart/react";
import { useRouter } from "next/navigation";
import { useFileStore } from "~/store";
import { extractUsername } from "~/utils/utils";
import type { EmojiSelectEvent } from "~/types/types";

const CommentInput: React.FC<{
  fileId?: string;
  commentId?: string;
  originalComment?: string;
  setOpen?: (open: boolean) => void;
  setOpenDropDown?: (open: boolean) => void;
}> = ({ fileId, commentId, originalComment, setOpen, setOpenDropDown }) => {
  const { replyData, setReplyData } = useFileStore();
  const router = useRouter();
  const theme = useTheme();
  const formSchema = z.object({
    comment: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: commentId
        ? originalComment
        : replyData.isReplying
          ? `${replyData.content}`
          : "",
    },
  });
  const utils = api.useUtils();
  const { mutate: updateComment, isPending: isUpdatingComment } =
    api.comment.updateComment.useMutation({
      onSuccess: () => {
        if (setOpen && setOpenDropDown) {
          setOpen(false);
          setOpenDropDown(false);
        }
        void utils.file.getFileById.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
      },
    });

  const { mutate: postComment, isPending: isPostingComment } =
    api.comment.postComment.useMutation({
      onSuccess: () => {
        void utils.file.getFileById.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
        router.refresh();
        form.reset();
      },
    });
  const { mutate: postReply, isPending: isPostingReply } =
    api.comment.postReply.useMutation({
      onSuccess: () => {
        void utils.file.getFileById.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
        router.refresh();
        form.reset();
        setReplyData({
          isReplying: false,
          commentId: "",
          content: "",
        });
      },
    });

  const onEmojiSelect = (emoji: EmojiSelectEvent) => {
    const currentComment = form.getValues("comment");
    form.setValue("comment", currentComment + emoji.native);
    setReplyData({
      ...replyData,
      content: currentComment + emoji.native,
    });
  };
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (originalComment === data.comment) {
      return;
    }
    if (replyData.isReplying) {
      postReply({ id: replyData.commentId, content: replyData.content });
    } else if (commentId && originalComment) {
      updateComment({ id: commentId, content: data.comment });
    } else {
      postComment({ id: fileId ?? "", content: data.comment });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-center justify-between gap-2"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  autoComplete="off"
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Write a comment ... "
                  value={
                    replyData.isReplying ? `${replyData.content}` : field.value
                  }
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (replyData.isReplying && newValue.trim().length === 0) {
                      setReplyData({
                        isReplying: false,
                        commentId: "",
                        content: "",
                      });
                    } else if (
                      replyData.isReplying &&
                      newValue.trim().length > 0
                    ) {
                      setReplyData({
                        ...replyData,
                        content: e.target.value,
                      });
                    }
                    field.onChange(newValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Popover>
          <PopoverTrigger className="hidden xl:block">
            <Smile size={20} />
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <Picker
              data={data}
              onEmojiSelect={onEmojiSelect}
              theme={theme.resolvedTheme}
              previewPosition="none"
              skinTonePosition="none"
            />
          </PopoverContent>
        </Popover>
        <Button
          className="hover:bg-none"
          variant="ghost"
          disabled={
            form.getValues("comment").trim().length === 0 ||
            form.getValues("comment").trim() ===
            extractUsername(replyData.content) ||
            isPostingComment ||
            isUpdatingComment ||
            isPostingReply
          }
        >
          <SendHorizontal size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default CommentInput;
