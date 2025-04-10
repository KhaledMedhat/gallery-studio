'use client'
import {
  User,
  Settings,
  LogOut,
  LifeBuoy,
  GalleryHorizontalEnd,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { deleteCookie } from "../actions";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User as UserType } from "~/types/types";
import { getInitials } from "~/utils/utils";

const UserProfile: React.FC<{
  user: UserType;
}> = ({ user }) => {
  const router = useRouter();
  const initials = getInitials(user?.firstName ?? "", user?.lastName ?? "");

  const handleLogout = async () => {
    await signOut();
    await deleteCookie();
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.profileImage?.imageUrl ?? undefined}
              alt={user.name ?? undefined}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User size={16} className="mr-2" />
            <Link href={`/${user.name}`}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GalleryHorizontalEnd size={16} className="mr-2" />
            <Link href={`/galleries/${user.gallery?.slug}`}>Gallery</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings size={16} className="mr-2" />
            <Link href={`/${user.name}/settings`}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <LifeBuoy size={16} className="mr-2" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
