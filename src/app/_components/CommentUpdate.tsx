import { api } from "~/trpc/react";
import Picker from "@emoji-mart/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smile, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import data, { type Emoji } from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const CommentUpdate: React.FC<{
  commentId: string;
  originalComment: string;
  setCommentIsUpdating: (arg: boolean) => void;
}> = ({ commentId, originalComment, setCommentIsUpdating }) => {
  const theme = useTheme();
  const utils = api.useUtils();
  const formSchema = z.object({
    comment: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: originalComment ?? "",
    },
  });
  const { mutate: updateComment, isPending: isUpdatingComment } =
    api.comment.updateComment.useMutation({
      onSuccess: () => {
        setCommentIsUpdating(false);
        void utils.comment.getAllComments.invalidate();
      },
    });
  const onEmojiSelect = (emoji: Emoji) => {
    const currentComment = form.getValues("comment");
    form.setValue("comment", currentComment + emoji.native);
  };
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (originalComment === data.comment) {
      setCommentIsUpdating(false);
      return;
    }

    updateComment({ id: commentId, content: data.comment });
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
                  {...field}
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
            />
          </PopoverContent>
        </Popover>
        <Button
          className="hover:bg-none"
          variant="ghost"
          disabled={
            form.getValues("comment").trim().length === 0 || isUpdatingComment
          }
        >
          <SendHorizontal size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default CommentUpdate;
