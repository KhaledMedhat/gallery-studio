'use client'
import Link from "next/link";
import { Button } from "~/components/ui/button";
import ModeToggle from "./ModeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { signOut } from "next-auth/react";
import { deleteCookie } from "../actions";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import {
    AtSign,
    BadgeHelp,
    Bell,
    FolderOpen,
    FolderPlus,
    Heart,
    House,
    ImagePlus,
    Images,
    LoaderCircle,
    LogOut,
    MessageCircle,
    Settings,
    Telescope,
    User,
    UserCheck,
    X,
} from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { useFileStore } from "~/store";
import { Input } from "~/components/ui/input";
import AddFileButton from "./AddFileButton";
import DeleteButton from "./DeleteButton";
import ToAlbumButton from "./ToAlbumButton";
import ChooseFilesModal from "./ChooseFilesModal";
import { getInitials } from "~/utils/utils";
import { NotificationTypeEnum, type User as UserType, type fileType } from "~/types/types";
import FromAlbumToAlbum from "./FromAlbumToAlbum";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Pusher from 'pusher-js'
import { FloatingDock } from "~/components/ui/floating-dock";
dayjs.extend(relativeTime);

const DockNavbar: React.FC<{
    user: UserType | null | undefined;
    files?: fileType[] | undefined;
}> = ({ user, files }) => {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const pathname = usePathname();
    const utils = api.useUtils();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { data: albums } = api.album.getAlbums.useQuery({
        id: user?.gallery?.slug ?? "",
    });
    const { selectedFiles, setSelectedFilesToEmpty, fileType } = useFileStore();
    const isAlbum = pathname.includes("albums");
    const isInsideAlbum = pathname.includes("albums/");
    const formSchema = z.object({
        albumTitle: z.string().min(1, { message: "Album name Cannot be empty." }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            albumTitle: "",
        },
    });
    const { data: notifications, isPending: isFetchNotificationPending, refetch } = api.notification.getNotifications.useQuery();

    const notificationCounter = notifications?.filter((notification) => !notification.isRead).length;
    const { mutate: updateNotificationIsRead } = api.notification.updateNotificationIsRead.useMutation({
        onSuccess: () => {
            void utils.notification.getNotifications.invalidate();
        }
    });
    const { mutate: addAlbum, isPending: isAddAlbumPending } =
        api.album.createAlbum.useMutation({
            onSuccess: () => {
                form.reset();
                toast({
                    title: "Created Successfully.",
                    description: `Album has been created successfully.`,
                });
                void utils.album.getAlbums.invalidate();
                setIsDialogOpen(false);
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `Uh oh! Something went wrong. Please try again.`,
                });
            },
        });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        addAlbum({
            title: data.albumTitle,
            id: user?.gallery?.slug ?? "",
        });
    };
    const handleLogout = async () => {
        router.push("/");
        await signOut({ callbackUrl: "/" });
        await deleteCookie();
        router.refresh();
    };
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        })
        const channel = pusher.subscribe(`notification-${user?.id}`)
        channel.bind('notification-event', async (newNotification: { content: string, sender: string, title: string }) => {
            await refetch()
            toast({
                title: `${newNotification.sender} ${newNotification.title}`,
                description: newNotification.content,
                duration: 5000,
            })
        })
        return () => {
            channel.unsubscribe()
            pusher.disconnect()
        }
    }, [refetch, user?.id])

    const items = [
        {
            title: 'Showcases',
            icon: <Telescope size={20} />,
            href: '/showcases',
            shouldRender: true,
            component: undefined
        },

        {
            title: 'Gallery',
            icon: <Images size={20} />,
            href: `/galleries/${user?.gallery?.slug}`,
            shouldRender: true,
            component: undefined
        },
        {
            title: 'Albums',
            icon: <FolderOpen size={20} />,
            href: `/galleries/${user?.gallery?.slug}/albums`,
            shouldRender: true,
            component: undefined
        },
        {
            title: 'Add Album',
            href: undefined,
            icon: undefined,
            component: <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost">
                        <FolderPlus
                            size={20}
                            className={`${albums && albums?.length === 0 && "animate-bounce"}`}
                        />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Album</DialogTitle>
                        <DialogDescription>
                            You can create new album from here and add your selected
                            images to it.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            id="album-id"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="albumTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter your album title.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <DialogFooter>
                        <Button
                            form="album-id"
                            type="submit"
                            disabled={isAddAlbumPending}
                        >
                            {isAddAlbumPending ? (
                                <LoaderCircle size={20} className="animate-spin" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>,
            shouldRender: isAlbum && !isInsideAlbum
        },
        {
            title: 'Add Showcase',
            icon: undefined,
            href: undefined,
            component: <AddFileButton
                gallerySlug={user?.gallery?.slug ?? ""}
                files={files}
                isEmptyPage={false}
            />,
            shouldRender: !isAlbum && !isInsideAlbum
        },
        {
            title: 'Choose Showcases',
            component: <ChooseFilesModal />,
            icon: undefined,
            href: undefined,
            shouldRender: isInsideAlbum
        },
        {
            title: 'Delete Showcases',
            component: <DeleteButton fileType={fileType} />,
            icon: undefined,
            href: undefined,
            shouldRender: selectedFiles.length > 0
        },
        {
            title: 'Move to Album',
            component: <ToAlbumButton gallerySlug={user?.gallery?.slug ?? ""} />,
            icon: undefined,
            href: undefined,
            shouldRender: selectedFiles.length > 0 && isInsideAlbum
        },
        {
            title: 'Move from Album to Album',
            component: <FromAlbumToAlbum gallerySlug={user?.gallery?.slug ?? ""} />,
            icon: undefined,
            href: undefined,
            shouldRender: selectedFiles.length > 0 && isInsideAlbum
        },
        {
            title: 'Cancel',
            component: <Button
                variant="ghost"
                className="hover:bg-transparent"
                onClick={() => setSelectedFilesToEmpty()}
            >
                <X size={20} />
            </Button>,
            icon: undefined,
            href: undefined,
            shouldRender: selectedFiles.length > 0
        },
        {
            title: 'Notifications',
            component: <Sheet>
                <SheetTrigger className="relative">
                    <Bell size={20} />
                    <div className={`${notifications?.length === 0 || isFetchNotificationPending ? "hidden" : "flex"} ${notificationCounter && notificationCounter > 9 ? 'h-5 w-7 -top-4 -right-4' : 'h-5 w-6 -top-4 -right-4'} rounded-full absolute z-50  bg-[#a52626]  items-center justify-center text-white text-[0.6rem] font-bold `}>
                        {notificationCounter && notificationCounter > 99 ? "99+" : notificationCounter}
                    </div>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto p-4">
                    <SheetHeader>
                        <SheetTitle>Notifications</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 flex flex-col gap-2 w-full">
                        {notifications?.map((notification) => (
                            <div key={notification.id} className={`flex flex-col cursor-pointer ${notification.isRead ? 'bg-transparent border ' : 'bg-input hover:bg-muted-foreground'} rounded-lg gap-2 h-fit p-2`} onClick={() => {
                                if (notification.notificationType === NotificationTypeEnum.FOLLOW) {
                                    router.push(`${notification.sender.name}`)
                                } else {
                                    router.push(`/showcases/${notification.fileId}`)

                                }
                                updateNotificationIsRead({ isRead: true, notificationId: notification.id })
                            }}>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Avatar className="h-14 w-14">
                                            <AvatarImage
                                                src={notification.sender.profileImage?.imageUrl ?? ""}
                                                alt={notification.sender.name ?? "Avatar"}
                                                className="object-cover"
                                            />
                                            <AvatarFallback
                                                className={`${resolvedTheme === "dark" ? "border-2 border-solid border-white" : "border-2 border-solid border-black"} text-sm`}
                                            >
                                                {getInitials(
                                                    notification.sender.firstName ?? "",
                                                    notification.sender.lastName ?? "",
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1">
                                            {notification.notificationType === NotificationTypeEnum.COMMENT && <MessageCircle fill={resolvedTheme === "dark" ? "#171717" : "#FFFFFF"} />}
                                            {notification.notificationType === NotificationTypeEnum.FOLLOW && <UserCheck fill={resolvedTheme === "dark" ? "#171717" : "#FFFFFF"} />}
                                            {notification.notificationType === NotificationTypeEnum.ADD_SHOWCASE && <ImagePlus fill={resolvedTheme === "dark" ? "#171717" : "#FFFFFF"} />}
                                            {notification.notificationType === NotificationTypeEnum.LIKE_COMMENT && <Heart fill={resolvedTheme === "dark" ? "#171717" : "#FFFFFF"} />}
                                            {notification.notificationType === NotificationTypeEnum.LIKE_SHOWCASE && <Heart fill={resolvedTheme === "dark" ? "#171717" : "#FFFFFF"} />}
                                            {notification.notificationType === NotificationTypeEnum.REPLY && <MessageCircle fill={resolvedTheme === "dark" ? "#171717" : "#FFFFFF"} />}
                                            {notification.notificationType === NotificationTypeEnum.MENTION && <AtSign />}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="text-sm font-semibold flex flex-col items-start">
                                            {notification.notificationContent?.sender} {notification.notificationContent?.title}
                                            <div className="text-xs w-fit font-semibold">
                                                {dayjs(notification?.createdAt).fromNow().replace('ago', '').replace('an', '1')}
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {notification.notificationContent?.content}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>,
            icon: undefined,
            href: undefined,
            shouldRender: true
        },
        {
            title: 'Mode',
            icon: undefined,
            href: undefined,
            shouldRender: true,
            component: <ModeToggle />
        },
        {
            title: 'Profile',
            component: <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        // asChild
                        className="hover:bg-transparent"
                        >
                        <Avatar>
                            <AvatarImage
                                src={user?.profileImage?.imageUrl ?? ""}
                                alt={user?.name ?? "Avatar"}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {getInitials(
                                    user?.firstName ?? "",
                                    user?.lastName ?? "",
                                )}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <User size={16} className="mr-2" />
                        <Link className="h-full w-full" href={`/${user?.name}`}>
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <House size={16} className="mr-2" />
                        <Link href={"/"}>Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Settings size={16} className="mr-2" />
                        <Link href={`/${user?.name}/settings`}>Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <BadgeHelp size={16} className="mr-2" />
                        <Link href={`/support`}>Support</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async () => {
                            await handleLogout();
                        }}
                    >
                        <LogOut size={16} className="mr-2" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>,
            icon: undefined,
            href: undefined,
            shouldRender: true
        },


    ]
    return (
        <div className="flex fixed bottom-0 right-4  md:w-full  items-center z-50 justify-center h-[5rem]">
            <FloatingDock
                items={items}
            />
        </div>
    )
}

export default DockNavbar