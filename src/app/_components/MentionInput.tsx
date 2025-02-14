import { SendHorizontal, Smile } from "lucide-react"
import { Mention, MentionsInput, type SuggestionDataItem } from "react-mentions"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { getInitials } from "~/utils/utils"
import { api } from "~/trpc/react"
import { ElementType, MentionType } from "~/types/types"
import { useParams, useRouter } from "next/navigation"
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import type { EmojiSelectEvent, inputContent, User } from "~/types/types";
import { useFileStore } from "~/store"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import * as React from "react"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"


const MentionInput: React.FC<{
    mentionType: MentionType;
    currentUser: User | undefined | null;
    inputType: ElementType;
    mentionInputValue?: string;
    fileId?: string;
    commentId?: string;
    originalComment?: string;
    setMentionInputValue?: (value: string) => void
}> = ({ mentionType, currentUser, inputType, mentionInputValue, setMentionInputValue, fileId, commentId, originalComment }) => {
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
                void utils.notification.getNotifications.invalidate();
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
                void utils.notification.getNotifications.invalidate();
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
            className={`flex gap-2 items-center max-w-full justify-between ${inputType === ElementType.TEXTAREA && 'rounded-md border border-input'}  bg-background text-sm ${isFocused && inputType === ElementType.TEXTAREA ? 'ring-offset-background outline-none ring-2 ring-ring ring-offset-2 ' : ''}`}
            onClick={() => setIsFocused(true)}
        >
            <MentionsInput
                style={{
                    control: {
                        maxWidth: '100%',
                        outline: 'none',
                    },
                    input: {
                        backgroundColor: 'transparent',
                        padding: '0.25rem 0.25rem',
                        outline: 'none',
                    },
                    suggestions: {
                        borderRadius: '6px',
                        backgroundColor: 'transparent',
                    }
                }}
                disabled={isPostingComment ||
                    isUpdatingComment ||
                    isPostingReply}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleInputSubmit()
                    }
                }
                }
                placeholder={inputType === ElementType.INPUT ? "Write a comment ..." : "Update your bio."}
                className={`p-1 max-w-[90%] ${inputType === ElementType.INPUT ? "h-fit outline-none" : "min-h-[80px]"} w-full `}
                customSuggestionsContainer={(children: React.ReactNode) => (
                    <ScrollArea className="max-h-72 h-fit w-48 flex flex-col gap-4 bg-background border rounded-md p-2">
                        {children}
                    </ScrollArea>
                )}
                forceSuggestionsAboveCursor={true}
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
                        const filteredFollowings = currentUser?.followings
                            ?.filter(following =>
                                following.name.includes(query))
                            ?.map((following) => ({
                                display: `@${following.name}`,
                                id: following.id
                            })) ?? [];
                        if (filteredFollowings.length === 0) {
                            filteredFollowings.push({
                                id: "no-result",
                                display: "No results found"
                            });
                        }
                        callback(filteredFollowings);
                    }}

                    appendSpaceOnAdd={true}
                    renderSuggestion={(
                        suggestion: SuggestionDataItem,
                        search: string,
                        highlightedDisplay: React.ReactNode,
                        index: number,
                        focused: boolean) => {
                        if (suggestion.id === "no-result") {
                            return (
                                <div className="p-2 text-sm text-muted-foreground">
                                    No results found
                                </div>
                            );
                        }

                        return (
                            <div className="flex flex-col gap-1 ">
                                <Button
                                    variant='ghost'
                                    className="flex w-full items-center justify-start gap-2 rounded-md p-2  hover:bg-muted-foreground"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser?.followings?.[index]?.profileImage?.imageUrl ?? ""} />
                                        <AvatarFallback>
                                            {getInitials(
                                                currentUser?.followings?.[index]?.firstName ?? "",
                                                currentUser?.followings?.[index]?.lastName ?? "",
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-bold text-accent-foreground">{currentUser?.followings?.[index]?.name}</p>
                                </Button>
                                {index < (currentUser?.followings?.length ?? 0) - 1 && <Separator />}
                            </div>
                        )
                    }}

                />

            </MentionsInput>
            <div className="flex gap-4 items-center pl-2">
                <Popover modal={popoverModality}>
                    <PopoverTrigger asChild className="hidden xl:block">
                        <Button
                            variant="ghost"
                            className="p-0"
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
                    className="hover:bg-none p-0"
                    variant="ghost"
                    onClick={handleInputSubmit}
                    disabled={commentMentionInputValue.content?.trim().length === 0 || isPostingComment ||
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