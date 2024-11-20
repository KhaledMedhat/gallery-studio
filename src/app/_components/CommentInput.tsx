import { zodResolver } from "@hookform/resolvers/zod";
import { Smile, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import data, { type Emoji } from '@emoji-mart/data'
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form"
import { api } from "~/trpc/react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useTheme } from "next-themes";
import Picker from '@emoji-mart/react'

const CommentInput: React.FC<{ fileId: string }> = ({ fileId }) => {
    const theme = useTheme()
    const formSchema = z.object({
        comment: z.string()
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
        },
    });
    const utils = api.useUtils();

    const { mutate: postComment } = api.comment.postComment.useMutation({
        onSuccess: () => {
            void utils.file.getFileById.invalidate();
            void utils.file.getShowcaseFiles.invalidate();
            form.reset()
        },
    })
    const onEmojiSelect = (emoji: Emoji) => {
        const currentComment = form.getValues("comment");
        form.setValue("comment", currentComment + emoji.native);

    }
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        postComment({ id: fileId, content: data.comment })
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full gap-2 items-center justify-between">
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Write a comment ... " {...field} />
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
                        <Picker data={data} onEmojiSelect={onEmojiSelect} theme={theme.resolvedTheme} />
                    </PopoverContent>
                </Popover>
                <Button className='hover:bg-none' variant='ghost' disabled={form.getValues("comment").length === 0}>
                    <SendHorizontal size={20} />
                </Button>
            </form>
        </Form>
    )
}

export default CommentInput