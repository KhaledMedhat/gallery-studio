import { LoaderCircle, SendHorizontal, Smile } from "lucide-react"
import { Mention, MentionsInput, type SuggestionDataItem } from "react-mentions"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { getInitials, getMention } from "~/utils/utils"
import classes from '../../styles/react-mentions.module.css'
import { api } from "~/trpc/react"
import { ElementType, MentionType } from "~/types/types"
import { useRouter } from "next/navigation"
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import type { EmojiSelectEvent } from "~/types/types";
import { useFileStore } from "~/store"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { useTheme } from "next-themes"
import { Input } from "~/components/ui/input"

const MentionInput: React.FC<{
    mentionType: MentionType;
    inputType: ElementType;
    mentionInputValue: string;
    fileId?: string;
    commentId?: string;
    originalComment?: string;
    setOpen?: (open: boolean) => void;
    setOpenDropDown?: (open: boolean) => void;
    setMentionInputValue: (value: string) => void
}> = ({ mentionType, inputType, mentionInputValue, setMentionInputValue, fileId, commentId, originalComment, setOpen, setOpenDropDown }) => {
    const { replyData, setReplyData } = useFileStore();
    const { resolvedTheme } = useTheme();
    const router = useRouter();
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
                // form.reset();
            },
        });
    const { mutate: postReply, isPending: isPostingReply } =
        api.comment.postReply.useMutation({
            onSuccess: () => {
                void utils.file.getFileById.invalidate();
                void utils.file.getShowcaseFiles.invalidate();
                router.refresh();
                // form.reset();
                setReplyData({
                    isReplying: false,
                    commentId: "",
                    content: "",
                });
            },
        });
    const onEmojiSelect = (emoji: EmojiSelectEvent) => {
        console.log(emoji);
        // const currentComment = form.getValues("comment");
        // form.setValue("comment", currentComment + emoji.native);
        // setReplyData({
        //     ...replyData,
        //     content: currentComment + emoji.native,
        // });
    };

    // investigate the mention input elements classes in inspect 
    const { mutate: mentionFollowingsSearch, data: mentionResult, isPending: isMentionSearchPending } = api.user.getFollowingUsersInMentionSearch.useMutation()
    const weirdContainer = document.querySelector(".flex__control")
    const weirdInputContainer = document.querySelector(".flex__input")
    weirdContainer?.setAttribute("style", "width: 80%; focus-visible: none;")
    weirdInputContainer?.setAttribute("style", "width: 100%; maxWidth:100%; resize: none; height: 100%; padding: 0.25rem 0.25rem; border: none; position: absolute; inset: 0;")

    return (
        <div className=" flex items-center w-full justify-between rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <MentionsInput
                placeholder="Update your bio."
                className={`flex ${classes.react_mention} p-1 ${inputType === ElementType.INPUT ? "h-10" : "min-h-[80px]"} w-full `}
                customSuggestionsContainer={(children: React.ReactNode) => {
                    return (
                        <div className="w-full h-full bg-background">
                            {children}
                        </div>
                    )
                }}
                singleLine={inputType === ElementType.INPUT ? true : false}
                value={mentionInputValue}
                onChange={(event: { target: { value: string } }) => setMentionInputValue(event.target.value)}
                >
                
                <Mention
                    className="bg-blue-500"
                    markup='[__display__]'
                    trigger={mentionType === MentionType.FOLLOWINGS ? "@" : "#"}
                    data={(query, callback: (data: SuggestionDataItem[]) => void) => {
                        const mentionUser = getMention(mentionInputValue);
                        mentionFollowingsSearch({ search: mentionUser?.trim() ?? "" });
                        callback(mentionResult?.map((result) => ({ display: `@${result.name}`, id: result.id })) ?? [])
                    }}
                    appendSpaceOnAdd={true}
                    renderSuggestion={() =>
                    (
                        <Card className="flex w-full flex-col rounded-md p-2">
                            {isMentionSearchPending ?
                                <LoaderCircle size={25} className="m-auto animate-spin" />
                                : mentionResult?.length === 0 ? <div className="text-center">You haven&apos;t followed anyone yet.</div> : mentionResult?.map((result) => (
                                    <Button
                                        key={result.id}
                                        variant='ghost'
                                        className="flex w-full items-center justify-start gap-2 rounded-md p-2 hover:bg-accent"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={result?.profileImage?.imageUrl ?? ""} />
                                            <AvatarFallback>
                                                {getInitials(
                                                    result?.firstName ?? "",
                                                    result?.lastName ?? "",
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm font-bold">{result?.name}</p>
                                    </Button>
                                ))}
                        </Card>
                    )

                    }

                />
                {/* <Mention
                trigger="#"
                data={this.requestTag}
                renderSuggestion={this.renderTagSuggestion}
            /> */}

            </MentionsInput>
         <div className="flex items-center">
         <Popover>
                <PopoverTrigger className="hidden xl:block">
                    <Smile size={20} />
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                    <Picker
                        data={data}
                        onEmojiSelect={onEmojiSelect}
                        theme={resolvedTheme}
                        previewPosition="none"
                        skinTonePosition="none"
                    />
                </PopoverContent>
            </Popover>
            <Button
                className="hover:bg-none"
                variant="ghost"
            // disabled={
            //     form.getValues("comment").trim().length === 0 ||
            //     form.getValues("comment").trim() ===
            //     extractUsername(replyData.content) ||
            //     isPostingComment ||
            //     isUpdatingComment ||
            //     isPostingReply
            // }
            >
                <SendHorizontal size={20} />
            </Button>
         </div>
        </div>

    )
}
export default MentionInput