"use client";
import {
  Folders,
  Home,
  ImagePlus,
  Images,
  LineChart,
  type LucideIcon,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  UserRound,
  Users2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { isURLActive } from "~/utils/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "~/store";
export interface BreadcrumbItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const GallerySidebar: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const pathname = usePathname();
  const { breadcrumbItems, setBreadcrumbItems, deleteBreadcrumbItems } =
    useUserStore();
  useEffect(() => {
    setBreadcrumbItems({
      label: "Gallery",
      href: `/galleries/${gallerySlug}`,
      icon: Home,
    });
  }, [gallerySlug, setBreadcrumbItems]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <div className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
            <Images className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Gallery</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/galleries/${gallerySlug}`}
                  className={`${isURLActive(pathname, `/galleries/${gallerySlug}`) ? "bg-accent text-accent-foreground" : "text-muted-foreground"} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Gallery</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Gallery</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="sr-only">Add Image</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Image</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setBreadcrumbItems({
                      label: "Albums",
                      href: `/galleries/${gallerySlug}/albums`,
                      icon: Folders,
                    })
                  }
                >
                  <Link
                    href={`/galleries/${gallerySlug}/albums`}
                    className={`${isURLActive(pathname, `/galleries/${gallerySlug}/albums`) ? "bg-accent text-accent-foreground" : "text-muted-foreground"} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <Folders className="h-5 w-5" />
                    <span className="sr-only">Albums</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Albums</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setBreadcrumbItems({
                      label: "Profile",
                      href: `/galleries/${gallerySlug}/profile`,
                      icon: UserRound,
                    })
                  }
                >
                  <Link
                    href={`/galleries/${gallerySlug}/profile`}
                    className={`${isURLActive(pathname, `/galleries/${gallerySlug}/profile`) ? "bg-accent text-accent-foreground" : "text-muted-foreground"} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
                  >
                    <UserRound className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex w-full flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="gap-2 md:flex">
            {breadcrumbItems.map((breadcrumbItem, index) => (
              <BreadcrumbList key={index}>
                <BreadcrumbItem
                  className={`${isURLActive(pathname, breadcrumbItem.href) && "bg-accent text-accent-foreground"} `}
                >
                  <BreadcrumbLink asChild>
                    <Button
                      className="p-0"
                      variant="ghost"
                      onClick={() => deleteBreadcrumbItems(index)}
                    >
                      <Link href={breadcrumbItem.href}>
                        {breadcrumbItem.label}
                      </Link>
                    </Button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbList>
            ))}
          </Breadcrumb>
          {/* <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/placeholder-user.jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
    </>
  );
};

export default GallerySidebar;
