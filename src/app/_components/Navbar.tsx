"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sun, Moon, Menu, Search, X, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import UserProfile, { type UserSession } from "./UserProfile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { isURLActive } from "~/utils/utils";
export interface UserGallery {
  createdAt: Date;
  id: number;
  createdById: string;
  slug: string;
}
const Navbar: React.FC<{ userGallery: UserGallery | undefined }> = ({
  userGallery,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const { setTheme } = useTheme();
  const theme = useTheme();
  const pathname = usePathname();

  const { data: session } = api.user.getUser.useQuery();

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return null; // or a loading placeholder
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container m-auto flex h-14 items-center">
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
              href="#"
              className={` ${isURLActive(pathname, "/") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Home
            </Link>
            <Link
              href={`/galleries/${userGallery?.slug}`}
              className={` ${isURLActive(pathname, `/galleries/${userGallery?.slug}`) ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Gallery
            </Link>
            <Link
              href="#"
              className={` ${isURLActive(pathname, "/artists") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Artists
            </Link>
            <Link
              href="#"
              className={` ${isURLActive(pathname, "/about") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              About
            </Link>
            <Link
              href="#"
              className={` ${isURLActive(pathname, "/contact") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 space-x-2 md:justify-end">
          <motion.div
            className="relative"
            initial={false}
            animate={isSearchExpanded ? "expanded" : "collapsed"}
          >
            <motion.div
              variants={{
                expanded: { width: "250px", opacity: 1 },
                collapsed: { width: "40px", opacity: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <Input
                ref={searchInputRef}
                value={searchValue}
                className="w-full"
                placeholder="Search..."
                onBlur={() => setIsSearchExpanded(false)}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </motion.div>
            <div className="absolute bottom-0 right-0 top-0 flex items-center">
              {isSearchExpanded && 
                  <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchValue("");
                    searchInputRef.current?.focus();
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              }
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsSearchExpanded(true);
                  setTimeout(() => {
                    searchInputRef.current?.focus();
                  }, 300);
                }}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </motion.div>

          {session ? (
            <UserProfile session={session as UserSession} />
          ) : (
            <Button variant="default" className="m-0 px-4 py-0">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-4">
                        <span>System</span>
                        <Info className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      System mode Adapts to your device&apos;s theme settings.
                      Automatically switches between light and dark modes based
                      on your operating system&apos;s appearance
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="#">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#">Gallery</Link>
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
