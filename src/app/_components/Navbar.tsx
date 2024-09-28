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
import { Sun, Moon, Menu, Search, X } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import UserProfile, { type UserSession } from "./UserProfile";

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useTheme();
  const theme = useTheme();
  const pathname = usePathname();

  const { data: session } = api.user.getUser.useQuery();

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClearSearch = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setSearchValue("");
    inputRef.current?.focus();
  };
  const handleSearchClick = () => {
    setSearchFocused(true);
    inputRef.current?.focus();
  };

  const isURLActive = (url: string) => {
    return pathname === url;
  };
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
              className={` ${isURLActive("/") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Home
            </Link>
            <Link
              href="#"
              className={` ${isURLActive("/gallery") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Gallery
            </Link>
            <Link
              href="#"
              className={` ${isURLActive("/artists") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Artists
            </Link>
            <Link
              href="#"
              className={` ${isURLActive("/about") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              About
            </Link>
            <Link
              href="#"
              className={` ${isURLActive("/contact") ? "font-bold text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 space-x-2 md:justify-end">
          <motion.div
            ref={searchContainerRef}
            initial={false}
            animate={searchFocused ? { width: "40%" } : { width: "2rem" }}
            className="relative cursor-pointer"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={handleSearchClick}
          >
            <Input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search artworks..."
              className={`w-full p-0 ${!searchFocused ? "opacity-0" : "py-2 pl-8 pr-4 opacity-100"}`}
            />
            <Search
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground transition-all ${
                searchFocused ? "left-2" : "left-1/2 -translate-x-1/2"
              }`}
            />
            {searchFocused && searchValue && (
              <X
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-muted-foreground"
                onClick={handleClearSearch}
              />
            )}
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
                System
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
