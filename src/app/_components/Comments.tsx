import { CalendarIcon, Ellipsis, Heart } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "~/components/ui/hover-card";
import type { User, Comment } from "~/types/types";
import {
    extractComment,
    extractUsername,
    extractUsernameWithoutAt,
    getInitials,
} from "~/utils/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Separator } from "~/components/ui/separator";
import LikeButton from "./LikeButton";
import { useFileStore } from "~/store";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { boolean } from "drizzle-orm/mysql-core";
import CommentUpdate from "./CommentUpdate";

dayjs.extend(relativeTime);
const Comments: React.FC<{
    slicedComments: Comment[];
    currentUser: User | undefined | null;
    fileId: string;
}> = ({ slicedComments, currentUser, fileId }) => {
    const { setIsCommenting, setIsReplying, setCommentInfo } = useFileStore();
    const [isCommentUpdating, setCommentIsUpdating] = useState<boolean>(false);
    const utils = api.useUtils();
    const { mutate: deleteComment, isPending: isDeletingComment } =
        api.comment.deleteComment.useMutation({
            onSuccess: () => {
                void utils.comment.getAllComments.invalidate();
            },
        });
    const theme = useTheme();
    const renderComments = (comments: Comment[], isReply = false) => {
        return comments.map((comment) => (
            <div
                key={comment.id}
                className={`flex w-full flex-col gap-2 ${isReply && "ml-8"}`}
            >
                <div
                    className={`flex w-full items-center justify-center ${isReply ? "max-w-[80%]" : "max-w-full justify-center"}`}
                >
                    <div className="flex w-full gap-1">
                        <div className="relative">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.user?.image ?? ""} />
                                <AvatarFallback
                                    className={`${theme.resolvedTheme === "dark" ? "border-2 border-solid border-white" : "border-2 border-solid border-black"} text-sm`}
                                >
                                    {getInitials(
                                        comment.user?.firstName ?? "",
                                        comment.user?.lastName ?? "",
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <Separator
                                orientation="vertical"
                                className={`h-[5.5rem] absolute left-4 top-10 ${theme.resolvedTheme === "dark" ? "bg-accent" : "bg-accent-foreground"}`}
                            />
                        </div>

                        <div className="flex flex-col items-start gap-1">
                            <div
                                className={`${theme.resolvedTheme === "dark" ? "bg-accent" : "bg-gray-200"} ${!isReply && "max-w-[45%] md:max-w-[70%] xl:max-w-[90%]"} w-fit overflow-hidden rounded-md px-2 py-1`}
                            >
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Button variant="link" className="h-fit p-0 font-bold">
                                            <Link href={`/${comment?.user?.name}`}>
                                                {comment.user?.name}
                                            </Link>
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="flex items-center justify-start space-x-4">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={comment.user?.image ?? ""} />
                                                <AvatarFallback>
                                                    {getInitials(
                                                        comment.user?.firstName ?? "",
                                                        comment.user?.lastName ?? "",
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                    @{comment.user?.name}
                                                </h4>
                                                <p className="text-sm">
                                                    {comment.user?.bio ? `${comment.user?.bio}.` : ""}
                                                </p>
                                                <div className="flex items-center pt-2">
                                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                                                    <span className="text-xs text-muted-foreground">
                                                        Joined{" "}
                                                        {dayjs(comment.user?.createdAt).format("MMMM")}{" "}
                                                        {dayjs(comment.user?.createdAt).format("YYYY")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                                <div className="flex items-center gap-1 flex-col md:flex-row">
                                    {extractUsername(comment.content) && (
                                        <Button variant="link" className="h-fit p-0 font-bold">
                                            <Link
                                                className="h-fit"
                                                href={`/${extractUsernameWithoutAt(comment.content)}`}
                                            >
                                                {extractUsername(comment.content)}
                                            </Link>
                                        </Button>
                                    )}
                                    {isCommentUpdating ? (
                                        <CommentUpdate
                                            commentId={comment.id}
                                            originalComment={comment.content}
                                            setCommentIsUpdating={setCommentIsUpdating}
                                        />
                                    ) : (
                                        <p className="h-fit overflow-hidden overflow-ellipsis whitespace-normal break-words">
                                            {extractComment(comment.content)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex h-fit items-center space-x-2 text-sm text-muted-foreground">
                                <LikeButton
                                    userId={currentUser?.id}
                                    commentId={comment.id}
                                    likesCount={comment.likesInfo?.length}
                                    commentLikesInfo={comment.likesInfo}
                                    likedUsers={comment.likedUsers}
                                />
                                {comment.userId === currentUser?.id ? null : (
                                    <Button
                                        className="h-fit p-0"
                                        variant="link"
                                        size="sm"
                                        onClick={() => {
                                            setIsReplying(true);
                                            setCommentInfo({
                                                commentId: comment.id,
                                                commentUsername: comment.user.name,
                                            });
                                        }}
                                    >
                                        Reply
                                    </Button>
                                )}
                                <span className="h-fit">
                                    {dayjs(comment.createdAt).fromNow()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        {currentUser?.id === comment.userId && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-fit p-0 hover:bg-transparent"
                                    >
                                        <Ellipsis size={30} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="p-0">
                                            <Button
                                                onClick={() => setCommentIsUpdating(true)}
                                                variant="ghost"
                                                className="w-full cursor-pointer p-0 hover:bg-transparent"
                                            >
                                                Edit
                                            </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="w-full cursor-pointer p-0 text-destructive hover:bg-transparent hover:text-[#d33939]"
                                            asChild
                                        >
                                            <Button
                                                onClick={() => deleteComment({ id: comment.id })}
                                                variant="ghost"
                                                className="hover:bg-transparent"
                                                disabled={isDeletingComment}
                                            >
                                                Delete
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
                {comment.replies && renderComments(comment.replies.slice(0, 2), true)}
            </div>
        ));
    };
    return (
        <div className="flex flex-col gap-2 px-2 py-1">
            {renderComments(slicedComments.slice(0, 2))}
            {/* <Button className="" variant="link">
                <Link href={`/showcases/${fileId}`}>
                    Show all comments
                </Link>
            </Button> */}
        </div>
    );
};

export default Comments;

// comments.map((comment) => (

// <div key={comment.id} className={`relative w-full flex flex-col gap-2 ${isReply && 'ml-8'}`}>
// {currentUser?.id === comment.userId && <div className="absolute right-0">
//     <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="hover:bg-transparent h-fit p-0">
//                 <Ellipsis size={30} />
//             </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//             <DropdownMenuGroup>
//                 <DropdownMenuItem className="p-0">
//                     <Button
//                         onClick={() => setCommentIsUpdating(true)}
//                         variant="ghost"
//                         className="p-0 hover:bg-transparent w-full cursor-pointer"
//                     >
//                         Edit
//                     </Button>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem className="w-full cursor-pointer p-0 text-destructive hover:bg-transparent hover:text-[#d33939]" asChild>
//                     <Button
//                         onClick={() => deleteComment({ id: comment.id })}
//                         variant="ghost"
//                         className="hover:bg-transparent"
//                         disabled={isDeletingComment}
//                     >
//                         Delete
//                     </Button>
//                 </DropdownMenuItem>
//             </DropdownMenuGroup>
//         </DropdownMenuContent>
//     </DropdownMenu>
// </div>}
//     <div className={`flex gap-1  `}>
//         <div className="relative">
// <Avatar className="h-8 w-8">
//     <AvatarImage src={comment.user?.image ?? ""} />
//     <AvatarFallback className={`${theme.resolvedTheme === 'dark' ? 'border-white border-2 border-solid' : 'border-black border-2 border-solid'} text-sm`}>{getInitials(comment.user?.firstName ?? "", comment.user?.lastName ?? "")}</AvatarFallback>
// </Avatar>
// {comment.replies && comment.replies.length > 0 && (
//     <Separator
//         orientation='vertical'
//         className={`  ${isReply ? 'h-[2.5rem]' : 'h-[5.5rem]'} absolute left-4 top-10 ${theme.resolvedTheme === 'dark' ? 'bg-accent' : 'bg-accent-foreground'}`}
//     />
//             )}
//         </div>
//         <div className="max-w-[80%] w-fit">
//             <div className={`${theme.resolvedTheme === 'dark' ? 'bg-accent' : 'bg-gray-200'} rounded-lg p-2`}>
// <HoverCard>
//     <HoverCardTrigger asChild>
//         <Button variant="link" className="p-0 font-bold h-fit">
//             <Link href={`/${comment?.user?.name}`}>
//                 {comment.user?.name}
//             </Link>
//         </Button>
//     </HoverCardTrigger>
//     <HoverCardContent className="w-80">
//         <div className="flex items-center justify-start space-x-4">
//             <Avatar className="h-8 w-8">
//                 <AvatarImage src={comment.user?.image ?? ""} />
//                 <AvatarFallback>{getInitials(comment.user?.firstName ?? "", comment.user?.lastName ?? "")}</AvatarFallback>
//             </Avatar>
//             <div className="space-y-1">
//                 <h4 className="text-sm font-semibold">@{comment.user?.name}</h4>
//                 <p className="text-sm">{comment.user?.bio ? `${comment.user?.bio}.` : ""}</p>
//                 <div className="flex items-center pt-2">
//                     <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
//                     <span className="text-xs text-muted-foreground">
//                         Joined {dayjs(comment.user?.createdAt).format("MMMM")} {dayjs(comment.user?.createdAt).format("YYYY")}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     </HoverCardContent>
// </HoverCard>
//                 <div className="h-fit flex items-center gap-1">
// {extractUsername(comment.content) && (
//     <Button variant='link' className="p-0 h-fit font-bold">
//         <Link className="h-fit" href={`/${extractUsernameWithoutAt(comment.content)}`}>
//             {extractUsername(comment.content)}
//         </Link>
//     </Button>
// )}
// {isCommentUpdating ?
//     <CommentUpdate commentId={comment.id} originalComment={comment.content} setCommentIsUpdating={setCommentIsUpdating} />
//     : <p className="h-fit overflow-hidden overflow-ellipsis whitespace-normal break-words">{extractComment(comment.content)}</p>}

//                 </div>
//             </div>
// <div className="flex items-center space-x-2 text-sm text-muted-foreground h-fit">
//     <LikeButton
//         userId={currentUser?.id}
//         commentId={comment.id}
//         likesCount={comment.likesInfo?.length}
//         commentLikesInfo={comment.likesInfo}
//         likedUsers={comment.likedUsers}
//     />
//     {comment.userId === currentUser?.id ? null : (
//         <Button
//             className="p-0 h-fit"
//             variant="link"
//             size="sm"
//             onClick={() => {
//                 setIsReplying(true);
//                 setCommentInfo({ commentId: comment.id, commentUsername: comment.user.name });
//             }}
//         >
//             Reply
//         </Button>
//     )}
//     <span className="h-fit">{dayjs(comment.createdAt).fromNow()}</span>
// </div>
//         </div>
//     </div>

// {comment.replies &&
//     renderComments(comment.replies.slice(0, 2), true)
// }

// </div >
