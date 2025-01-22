"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Dock, DockIcon } from "~/components/ui/dock";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
  FolderOpen,
  FolderPlus,
  Images,
  LoaderCircle,
  Telescope,
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
import BlurFade from "~/components/ui/blur-fade";
import AddFileButton from "./AddFileButton";
import DeleteButton from "./DeleteButton";
import ToAlbumButton from "./ToAlbumButton";
import ChooseFilesModal from "./ChooseFilesModal";
import { getInitials, isURLActive } from "~/utils/utils";
import type { User, fileType } from "~/types/types";
import FromAlbumToAlbum from "./FromAlbumToAlbum";
import { useState } from "react";

const GalleryNavbar: React.FC<{
  user: User | null | undefined;
  files: fileType[] | undefined;
}> = ({ user, files }) => {
  const router = useRouter();
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
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] mx-auto mb-4 flex h-full max-h-14 origin-bottom">
      <div className="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock
        direction="middle"
        className="pointer-events-auto relative bottom-8 z-50 mx-auto mb-4 flex origin-bottom gap-2 rounded-3xl bg-background"
      >
        <DockIcon>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  asChild
                  className={`${isURLActive(pathname, "/showcases") && "rounded-full bg-accent p-3 text-accent-foreground"}`}
                >
                  <Link href={"/showcases"}>
                    <Telescope size={20} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Showcases</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DockIcon>
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  asChild
                  className={`${isURLActive(pathname, `/galleries/${user?.gallery?.slug}`) && "bg-accent text-accent-foreground"}`}
                >
                  <Link href={`/galleries/${user?.gallery?.slug}`}>
                    <Images size={20} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Gallery</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DockIcon>
        <DockIcon>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  asChild
                  className={`${isURLActive(pathname, `/galleries/${user?.gallery?.slug}/albums`) && "bg-accent text-accent-foreground"}`}
                >
                  <Link href={`/galleries/${user?.gallery?.slug}/albums`}>
                    <FolderOpen size={20} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Albums</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DockIcon>

        <DockIcon>
          {isAlbum && !isInsideAlbum && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="ghost">
                        <FolderPlus
                          size={20}
                          className={`${albums && albums?.length === 0 && "animate-bounce"}`}
                        />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Add Album</TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            </Dialog>
          )}
          {isInsideAlbum && <ChooseFilesModal />}
          {!isAlbum && !isInsideAlbum && (
            <AddFileButton
              gallerySlug={user?.gallery?.slug ?? ""}
              files={files}
              isEmptyPage={false}
            />
          )}
        </DockIcon>
        {selectedFiles.length > 0 && (
          <DockIcon className="hidden xl:flex">
            <DeleteButton fileType={fileType} />
          </DockIcon>
        )}
        {selectedFiles.length > 0 && !isInsideAlbum && (
          <DockIcon className="hidden xl:flex">
            <ToAlbumButton gallerySlug={user?.gallery?.slug ?? ""} />
          </DockIcon>
        )}
        {selectedFiles.length > 0 && isInsideAlbum && (
          <DockIcon className="hidden xl:flex">
            <FromAlbumToAlbum gallerySlug={user?.gallery?.slug ?? ""} />
          </DockIcon>
        )}
        {selectedFiles.length > 0 && (
          <DockIcon className="hidden xl:flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BlurFade delay={0} inView yOffset={0}>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedFilesToEmpty()}
                    >
                      <X size={20} />
                    </Button>
                  </BlurFade>
                </TooltipTrigger>
                <TooltipContent>Cancel</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DockIcon>
        )}
        <DockIcon>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModeToggle />
              </TooltipTrigger>
              <TooltipContent>Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DockIcon>
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="overflow-hidden rounded-full"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user?.image?.imageUrl ?? ""}
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
                </TooltipTrigger>
                <TooltipContent>Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link className="h-full w-full" href={`/${user?.name}`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href={"/"}>Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Support
              </DropdownMenuItem>
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
        </DockIcon>
      </Dock>
    </div>
  );
};

export default GalleryNavbar;
