import { LoaderCircle, SendHorizontal, Smile } from "lucide-react"
import { Mention, MentionsInput, type SuggestionDataItem } from "react-mentions"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { extractUsername, getInitials, getMention } from "~/utils/utils"
import classes from '../../styles/react-mentions.module.css'
import { api } from "~/trpc/react"
import { ElementType, MentionType } from "~/types/types"
import { useParams, useRouter } from "next/navigation"
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import type { EmojiSelectEvent, inputContent } from "~/types/types";
import { useFileStore } from "~/store"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import * as React from "react"


const MentionInput: React.FC<{
    mentionType: MentionType;
    inputType: ElementType;
    mentionInputValue?: string;
    fileId?: string;
    commentId?: string;
    originalComment?: string;
    setMentionInputValue?: (value: string) => void
}> = ({ mentionType, inputType, mentionInputValue, setMentionInputValue, fileId, commentId, originalComment }) => {
    const { replyData, setReplyData } = useFileStore();
    const param = useParams()
    const [popoverModality, setPopoverModality] = useState<boolean>(false)
    const [commentMentionInputValue, setCommentMentionInputValue] = useState<inputContent>({ isReplying: false, commentId: commentId ? commentId : "", content: commentId && originalComment ? originalComment : "" })
    useEffect(() => {
        if (replyData.isReplying && commentMentionInputValue?.content.trim().length === 0) {
            setReplyData({
                isReplying: false,
                commentId: "",
                content: "",
            });
        }
        if (replyData.isReplying) {
            setCommentMentionInputValue({ isReplying: true, commentId: replyData.commentId, content: replyData.content })
        }

    }, [commentId, commentMentionInputValue, originalComment, replyData.commentId, replyData.content, replyData.isReplying, setReplyData])
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const router = useRouter();
    const utils = api.useUtils();
    const { mutate: updateComment, isPending: isUpdatingComment } =
        api.comment.updateComment.useMutation({
            onSuccess: () => {
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
                setCommentMentionInputValue({ isReplying: false, content: "" })
            },
        });
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsFocused(false);
        }
    };

    useEffect(() => {
        if (param.fileId || commentId && originalComment) {
            setPopoverModality(true)
        } else {
            setPopoverModality(false)
        }
    }, [commentId, originalComment, param.fileId])
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const { mutate: postReply, isPending: isPostingReply } =
        api.comment.postReply.useMutation({
            onSuccess: () => {
                void utils.file.getFileById.invalidate();
                void utils.file.getShowcaseFiles.invalidate();
                router.refresh();
                setCommentMentionInputValue({ isReplying: false, commentId: "", content: "" })
                setReplyData({
                    isReplying: false,
                    commentId: "",
                    content: "",
                });
            },
        });

    const onEmojiSelect = (emoji: EmojiSelectEvent) => {
        const currentValue = mentionInputValue ?? commentMentionInputValue.content;
        if (setMentionInputValue) {
            setMentionInputValue(currentValue + emoji.native)
        } else if (commentMentionInputValue.isReplying) {
            setCommentMentionInputValue({ isReplying: true, commentId: commentMentionInputValue.commentId, content: currentValue + emoji.native });
        } else {
            setCommentMentionInputValue({ isReplying: false, content: currentValue + emoji.native });
        }
    };
    const { mutate: mentionFollowingsSearch, data: mentionResult, isPending: isMentionSearchPending } = api.user.getFollowingUsersInMentionSearch.useMutation()
    if (typeof document !== 'undefined') {
        const mentionInputControl = document.querySelector(".flex__control")
        const mentionInputInput = document.querySelector(".flex__input")
        const mentionInputHighlighter = document.querySelector(".flex__highlighter")
        mentionInputControl?.setAttribute("style", "max-width: 100%; outline: none;")
        mentionInputInput?.setAttribute("style", "max-width: 90%; resize: none; height: 100%; padding: 0.25rem 0.25rem; border: none; position: absolute; inset: 0; outline: none;")
        mentionInputHighlighter?.setAttribute("style", "width: 100%; position:relative; color:transparent;overflow:hidden; overflow-wrap: pre-wrap; word-wrap: break-word; text-align: start; outline: none;")
    }
    const handleInputSubmit = () => {
        if (originalComment === commentMentionInputValue.content) {
            return;
        }
        if (commentMentionInputValue.isReplying) {
            postReply({ id: commentMentionInputValue.commentId ?? "", content: commentMentionInputValue.content });
        } else if (commentId && originalComment) {
            updateComment({ id: commentId, content: commentMentionInputValue.content });
        } else {
            postComment({ id: fileId ?? "", content: commentMentionInputValue.content });
        }


    }
    return (
        <div
            ref={containerRef}
            className={`flex items-center max-w-full justify-between ${inputType === ElementType.TEXTAREA && 'rounded-md border border-input'}  bg-background text-sm ${isFocused && inputType === ElementType.TEXTAREA ? 'ring-offset-background outline-none ring-2 ring-ring ring-offset-2 ' : ''}`} // Add outline class conditionally
            onClick={() => setIsFocused(true)}
        >
            <MentionsInput
                placeholder={inputType === ElementType.INPUT ? "Write a comment ..." : "Update your bio."}
                className={`${classes.react_mention} p-1 ${inputType === ElementType.INPUT ? "h-fit outline-none" : "min-h-[80px]"} w-full `}
                customSuggestionsContainer={(children: React.ReactNode) => {
                    return (
                        <div className="w-full h-full bg-background">
                            {children}
                        </div>
                    )
                }}
                singleLine={inputType === ElementType.INPUT ? true : false}
                value={mentionInputValue ?? commentMentionInputValue.content}
                onChange={(event: { target: { value: string } }) => {
                    if (setMentionInputValue) {
                        setMentionInputValue(event.target.value)
                    } else if (commentMentionInputValue.isReplying) {
                        setCommentMentionInputValue({ isReplying: true, commentId: commentMentionInputValue.commentId, content: event.target.value })
                    } else {
                        setCommentMentionInputValue({ isReplying: false, commentId: "", content: event.target.value })

                    }

                }}
            >

                <Mention
                    className="bg-blue-500"
                    markup='[__display__]'
                    trigger={mentionType === MentionType.FOLLOWINGS ? "@" : "#"}
                    data={(query, callback: (data: SuggestionDataItem[]) => void) => {
                        if (mentionInputValue || commentMentionInputValue) {
                            const mentionUser = getMention(mentionInputValue ?? commentMentionInputValue.content);
                            mentionFollowingsSearch({ search: mentionUser?.trim() ?? "" });
                            callback(mentionResult?.map((result) => ({ display: `@${result.name}`, id: result.id })) ?? [])
                        }

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

            </MentionsInput>
            <div className="flex items-center">
                <Popover modal={popoverModality}>
                    <PopoverTrigger asChild className="hidden xl:block">
                        <Button
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}>
                            <Smile size={20} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        onPointerDownOutside={() => {
                            setPopoverModality(false)
                        }}
                        className="w-fit">
                        <Picker
                            data={data}
                            onEmojiSelect={onEmojiSelect}
                            theme={resolvedTheme}
                            previewPosition="none"
                            skinTonePosition="none"
                        />
                    </PopoverContent>
                </Popover>
                {ElementType.INPUT === inputType && <Button
                    className="hover:bg-none"
                    variant="ghost"
                    onClick={handleInputSubmit}
                    disabled={commentMentionInputValue.content?.trim().length === 0 || commentMentionInputValue.content?.trim() ===
                        extractUsername(replyData.content) || isPostingComment ||
                        isUpdatingComment ||
                        isPostingReply}
                >
                    <SendHorizontal size={20} />
                </Button>}
            </div>
        </div>

    )
}
export default MentionInput