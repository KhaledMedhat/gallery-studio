"use client";
import Link from "next/link";
import Image from "next/legacy/image";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import UserAvatarProfile from "./UserAvatarProfile";
import { isURLActive } from "~/utils/utils";
import ModeToggle from "./ModeToggle";
import { type User } from "~/types/types";
import { signIn } from "next-auth/react";

const Navbar: React.FC<{ currentUser: User | null | undefined }> = ({
  currentUser,
}) => {
  const theme = useTheme();
  const pathname = usePathname();
  return (
    <header className="container sticky top-0 z-40 mx-auto mt-1 w-full border-b bg-background/95 px-2 pt-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src={
                theme.resolvedTheme === "dark"
                  ? "/logo-white.svg"
                  : "/logo-black.svg"
              }
              alt="Logo"
              width={120}
              height={100}
            />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={` ${isURLActive(pathname, "/") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Home
            </Link>
            <Link
              href="/search"
              className={` ${isURLActive(pathname, "/artists") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Artists
            </Link>
            <Link
              href="/about"
              className={` ${isURLActive(pathname, "/about") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              About
            </Link>
            <Link
              href="/support"
              className={` ${isURLActive(pathname, "/support") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Support
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 space-x-2 px-2 md:justify-end">
          {currentUser ? (
            <UserAvatarProfile user={currentUser} />
          ) : (
            <Button variant="default" className="m-0 px-4 py-0" onClick={() => signIn()}>
              Login
            </Button>
          )}
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#">Artists</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#">Contact</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
