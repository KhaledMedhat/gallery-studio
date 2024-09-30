import {Folders, Home, ImagePlus, UserRound, type LucideIcon } from "lucide-react";

interface SidebarItem {
    label: string;
    href?: string;
    icon: LucideIcon;
    type: "link" | "button";
}

export const sidebarItems: SidebarItem[] = [
    {
        label: "Gallery",
        href: undefined,
        icon: Home,
        type: "link",
    },
    {
        label: "Add Image",
        href: undefined,
        icon: ImagePlus,
        type: "button",
    },
    {
        label: "Albums",
        href: "/albums",
        icon: Folders,
        type: "link",
    },
    {
        label: "Profile",
        href: "/profile",
        icon: UserRound,
        type: "link",
    },
]