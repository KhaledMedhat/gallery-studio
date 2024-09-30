"use client";
import {
  Home,
  Images,
  LineChart,
  type LucideIcon,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Trash2,
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
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { isURLActive } from "~/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useImageStore, useUserStore } from "~/store";
import { sidebarItems } from "~/constants/consts";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import UploadthingButton from "./UploadthingButton";
import { Progress } from "~/components/ui/progress";
import { deleteCookie, deleteFileOnServer } from "../actions";
import { useToast } from "~/hooks/use-toast";
import { ToastAction } from "~/components/ui/toast";
import { signOut } from "next-auth/react";
export interface BreadcrumbItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const GallerySidebar: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { data: user } = api.user.getUser.useQuery();
  const utils = api.useContext();
  const { imageUrl, imageKey, isUploading, progress, setImageUrl } =
    useImageStore();
  const { breadcrumbItems, setBreadcrumbItems, deleteBreadcrumbItems } =
    useUserStore();
  useEffect(() => {
    setBreadcrumbItems({
      label: "Gallery",
      href: `/galleries/${gallerySlug}`,
      icon: Home,
    });
  }, [gallerySlug, setBreadcrumbItems]);

  const formSchema = z.object({
    caption: z.string(),
    tags: z.string().transform((str) =>
      str
        .split(" ")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      tags: [""],
    },
  });
  const { mutate: addImage } = api.image.createImage.useMutation({
    onSuccess: () => {
      void utils.image.getImage.invalidate();
      toast({
        description: <span>Your Image has been added successfully</span>,
      });
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addImage({
      url: imageUrl ?? "",
      imageKey: imageKey ?? "",
      caption: data.caption,
      tags: data.tags,
      gallerySlug,
    });
  };

  const handleLogout = async () => {
    router.push("/");
    await signOut({ callbackUrl: "/" });
    await deleteCookie();
  };
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <div className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
            <Images className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Gallery</span>
          </div>
          <TooltipProvider>
            {sidebarItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  {item.type === "link" ? (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setBreadcrumbItems({
                          label: item.label,
                          href: `${item.href ? `/galleries/${gallerySlug}/${item.href}` : `/galleries/${gallerySlug}`}`,
                          icon: item.icon,
                        })
                      }
                    >
                      <Link
                        href={`${item.href ? `/galleries/${gallerySlug}/${item.href}` : `/galleries/${gallerySlug}`}`}
                        className={`${isURLActive(pathname, `${item.href ? `/galleries/${gallerySlug}/${item.href}` : `/galleries/${gallerySlug}`}`) ? "bg-accent text-accent-foreground" : "text-muted-foreground"} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-muted-foreground"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="sr-only">{item.label}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Image</DialogTitle>
                          <DialogDescription>
                            Upload a new image to your gallery. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        {imageUrl && progress === 100 ? (
                          <>
                            <Image
                              src={imageUrl}
                              style={{ objectFit: "cover", height: "200px" }}
                              alt="Profile Picture"
                              width={200}
                              height={200}
                              className="mx-auto my-6 rounded-full"
                            />
                            <Button
                              className="flex w-full"
                              onClick={async () => {
                                if (imageKey) {
                                  await deleteFileOnServer(imageKey);
                                  setImageUrl("");
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </>
                        ) : isUploading ? (
                          <Progress value={progress} />
                        ) : (
                          <UploadthingButton isImageComponent={true} />
                        )}

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-8"
                          >
                            <div className="flex flex-col gap-6">
                              <FormField
                                control={form.control}
                                name="caption"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Caption</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Caption of the image"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Enter image caption.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                      <Input placeholder="#tags" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Enter image tags if you want to add them.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button type="submit">Save</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
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
              <nav className="grid gap-6 text-lg font-mediums">
                {/* {sidebarItems.map((item, index) =>
                  item.type === "link" ? (
                    <Button
                      className="bg-transparent hover:bg-transparent"
                      key={index}
                      variant="ghost"
                      onClick={() =>
                        setBreadcrumbItems({
                          label: item.label,
                          href: `${item.href ? `/galleries/${gallerySlug}/${item.href}` : `/galleries/${gallerySlug}`}`,
                          icon: item.icon,
                        })
                      }
                    >
                      <Link
                        href={`${item.href ? `/galleries/${gallerySlug}/${item.href}` : `/galleries/${gallerySlug}`}`}
                        className={`${isURLActive(pathname, `${item.href ? `/galleries/${gallerySlug}/${item.href}` : `/galleries/${gallerySlug}`}`) ? "text-accent-foreground" : "text-muted-foreground"} flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  ) : (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-muted-foreground hover:bg-transparent"
                        >
                          <span>{item.label}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Image</DialogTitle>
                          <DialogDescription>
                            Upload a new image to your gallery. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        {imageUrl && progress === 100 ? (
                          <>
                            <Image
                              src={imageUrl}
                              style={{ objectFit: "cover", height: "200px" }}
                              alt="Profile Picture"
                              width={200}
                              height={200}
                              className="mx-auto my-6 rounded-full"
                            />
                            <Button
                              className="flex w-full"
                              onClick={async () => {
                                if (imageKey) {
                                  await deleteFileOnServer(imageKey);
                                  setImageUrl("");
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </>
                        ) : isUploading ? (
                          <Progress value={progress} />
                        ) : (
                          <UploadthingButton isImageComponent={true} />
                        )}

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-8"
                          >
                            <div className="flex flex-col gap-6">
                              <FormField
                                control={form.control}
                                name="caption"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Caption</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Caption of the image"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Enter image caption.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                      <Input placeholder="#tags" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Enter image tags if you want to add them.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button type="submit">Save</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  ),
                )} */}
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
                  className={`${isURLActive(pathname, breadcrumbItem.href) && "bg-accent text-accent-foreground"} bg-transparent`}
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
                <Avatar>
                  <AvatarImage
                    src={user?.image ?? ""}
                    alt={user?.name ?? "Avatar"}
                  />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((part) => part[0]?.toUpperCase())
                      .join("") ?? ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {
                  await handleLogout();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
    </>
  );
};

export default GallerySidebar;
