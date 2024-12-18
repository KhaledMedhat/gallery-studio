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
import { useRouter } from "next/navigation";
import { useFileStore } from "~/store";
import { useEffect } from "react";

const CommentInput: React.FC<{ fileId: string, originalComment?: string | undefined }> = ({ fileId, originalComment }) => {
    const { setCommentIsUpdating, isReplying, setIsReplying, commentInfo, setCommentInfo } = useFileStore()
    const router = useRouter()
    const theme = useTheme()
    const formSchema = z.object({
        comment: z.string()
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: originalComment ?? "",
        },
    });
    useEffect(() => {
        if (commentInfo.commentUsername) {
            form.setValue("comment", `@${commentInfo.commentUsername} `)
        }
    }, [commentInfo.commentUsername, form, setCommentInfo])
    const utils = api.useUtils();
    const { mutate: updateComment, isPending: isUpdatingComment } = api.comment.updateComment.useMutation({
        onSuccess: () => {
            setCommentIsUpdating(false)
            void utils.file.getFileById.invalidate();
            void utils.file.getShowcaseFiles.invalidate();
        },
    })

    const { mutate: postComment, isPending: isPostingComment } = api.comment.postComment.useMutation({
        onSuccess: () => {
            void utils.file.getFileById.invalidate();
            void utils.file.getShowcaseFiles.invalidate();
            router.refresh()
            form.reset()
        },
    })
    const { mutate: postReply, isPending: isPostingReply } = api.comment.postReply.useMutation({
        onSuccess: () => {
            void utils.file.getFileById.invalidate();
            void utils.file.getShowcaseFiles.invalidate();
            router.refresh()
            form.reset()
            setIsReplying(false)
        },
    })
    const onEmojiSelect = (emoji: Emoji) => {
        const currentComment = form.getValues("comment");
        form.setValue("comment", currentComment + emoji.native);

    }
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        if (originalComment === data.comment) {
            setCommentIsUpdating(false)
            return
        }
        if (commentInfo?.commentId) {
            if (isReplying) {
                postReply({ id: commentInfo.commentId, content: data.comment })
            } else {
                updateComment({ id: commentInfo.commentId, content: data.comment })
            }
        } else {
            postComment({ id: fileId, content: data.comment })
        }
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
                                <Input autoComplete="off" className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Write a comment ... " {...field} />
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
                <Button className='hover:bg-none' variant='ghost' disabled={form.getValues("comment").trim().length === 0 || isPostingComment || isUpdatingComment || isPostingReply}>
                    <SendHorizontal size={20} />
                </Button>
            </form>
        </Form>
    )
}

export default CommentInput