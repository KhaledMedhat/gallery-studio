"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Dock, DockIcon } from "~/components/ui/dock";
import { Separator } from "~/components/ui/separator";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
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
import { deleteCookie, deleteFileOnServer } from "../actions";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  FolderPlus,
  GalleryHorizontalEnd,
  House,
  Library,
  LoaderCircle,
  Trash2,
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
import { ToastAction } from "~/components/ui/toast";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import BlurFade from "~/components/ui/blur-fade";
import AddFileButton from "./AddFileButton";

const GalleryNavbar: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: user } = api.user.getUser.useQuery();
  const { data: files } = api.file.getFiles.useQuery();
  const { data: albums } = api.album.getAlbums.useQuery({ id: gallerySlug });
  const { selectedFiles, setSelectedFilesToEmpty } = useFileStore();

  const albumsFormSchema = z.object({
    album: z.string({
      required_error: "Please select an album to add to.",
    }),
  });

  const albumForm = useForm<z.infer<typeof albumsFormSchema>>({
    resolver: zodResolver(albumsFormSchema),
    defaultValues: {
      album: "",
    },
  });

  const createAlbumFormSchema = z.object({
    album: z.string().min(1, { message: "Album name Cannot be empty." }),
  });
  const createAlbumForm = useForm<z.infer<typeof createAlbumFormSchema>>({
    resolver: zodResolver(createAlbumFormSchema),
    defaultValues: {
      album: "",
    },
  });

  const {
    mutate: addToNonExistedAlbum,
    isPending: isAddingToNonExistingAlbum,
  } = api.album.addingFilesToNonExistingAlbum.useMutation({
    onSuccess: () => {
      toast({
        title: "Created And Added Successfully.",
        description: `Images has been added to ${createAlbumForm.getValues("album")} album successfully.`,
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
  const { mutate: addToExistedAlbum, isPending: isAddingToExistingAlbum } =
    api.file.addToExistedAlbum.useMutation({
      onSuccess: () => {
        toast({
          title: "Added Successfully.",
          description: `Images has been added to ${albumForm.getValues("album")} album successfully.`,
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
  const { mutate: deleteFile, isPending: isDeleting } =
    api.file.deleteFile.useMutation({
      onSuccess: () => {
        setSelectedFilesToEmpty();
        toast({
          title: "Deleted Successfully.",
          description: `Images ${deleteFile.name} has been deleted successfully.`,
        });
        void utils.file.getFiles.invalidate();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Deleting Image Failed.",
          description: `Uh oh! Something went wrong. Please try again.`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
    });
  const onChooseAlbumSubmit = (albumData: z.infer<typeof albumsFormSchema>) => {
    const filesIds = selectedFiles.map((file) => file.id);

    addToExistedAlbum({
      id: filesIds,
      albumTitle: albumData.album,
    });
  };

  const onAddingFilesAfterCreatingAlbum = (
    createAlbumForm: z.infer<typeof createAlbumFormSchema>,
  ) => {
    const filesIds = selectedFiles.map((file) => file.id);
    addToNonExistedAlbum({
      title: createAlbumForm.album,
      id: gallerySlug,
      filesId: filesIds,
    });
  };
  const handleLogout = async () => {
    router.push("/");
    await signOut({ callbackUrl: "/" });
    await deleteCookie();
  };
  return (
    <Dock
      direction="middle"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto mb-4 flex origin-bottom gap-4 rounded-3xl bg-background"
    >
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={"/"}>
                <House className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Home</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>
      <Separator orientation="vertical" className="h-full py-2" />
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">
                <Link href={`/galleries/${gallerySlug}`}>
                  <GalleryHorizontalEnd className="h-5 w-5" />
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
              <Button variant="ghost">
                <Link href={`/galleries/${gallerySlug}/albums`}>
                  <Library className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Albums</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>

      <DockIcon>
        <AddFileButton gallerySlug={gallerySlug} files={files} />
      </DockIcon>
      {selectedFiles.length > 0 && (
        <DockIcon>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {isDeleting ? (
                  <LoaderCircle
                    size={25}
                    className="animate-spin text-destructive"
                  />
                ) : (
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      deleteFile({
                        id: selectedFiles.map((file) => file.id),
                      });
                      await deleteFileOnServer(
                        selectedFiles.map((file) => file.fileKey),
                      );
                    }}
                  >
                    <Trash2 size={25} className="text-destructive" />
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>Trash</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DockIcon>
      )}
      {selectedFiles.length > 0 && (
        <DockIcon>
          <Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <BlurFade delay={0} inView yOffset={0}>
                        <FolderPlus size={25} />
                      </BlurFade>
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Add to albums</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="flex max-w-2xl items-center">
              <VisuallyHidden.Root>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
              </VisuallyHidden.Root>
              <Tabs defaultValue="Albums" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="albums">Albums</TabsTrigger>
                  <TabsTrigger value="new-album">New Album</TabsTrigger>
                </TabsList>
                <TabsContent value="albums">
                  <Card>
                    <CardHeader>
                      <CardTitle>Albums</CardTitle>
                      <CardDescription>
                        Choose on of your albums to add your images to.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Form {...albumForm}>
                        <form
                          id="add-to-existed-album-form"
                          onSubmit={albumForm.handleSubmit(onChooseAlbumSubmit)}
                          className="w-full space-y-6"
                        >
                          <FormField
                            control={albumForm.control}
                            name="album"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Album</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an album to add to" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {albums?.map((album) => (
                                      <SelectItem
                                        key={album.id}
                                        value={album.name}
                                      >
                                        {album.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  You can create your albums from the New Album
                                  tap on the top right corner or from the albums
                                  page.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter>
                      <Button
                        form="add-to-existed-album-form"
                        type="submit"
                        disabled={isAddingToExistingAlbum}
                      >
                        {isAddingToExistingAlbum ? (
                          <LoaderCircle size={25} className="animate-spin" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="new-album">
                  <Card>
                    <CardHeader>
                      <CardTitle>New Album</CardTitle>
                      <CardDescription>
                        You can create new album from here and add your selected
                        images to it.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Form {...createAlbumForm}>
                        <form
                          id="add-to-non-existed-album-form"
                          onSubmit={createAlbumForm.handleSubmit(
                            onAddingFilesAfterCreatingAlbum,
                          )}
                          className="space-y-8"
                        >
                          <FormField
                            control={createAlbumForm.control}
                            name="album"
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
                    </CardContent>
                    <CardFooter>
                      <Button
                        form="add-to-non-existed-album-form"
                        type="submit"
                        disabled={isAddingToNonExistingAlbum}
                      >
                        {isAddingToNonExistingAlbum ? (
                          <LoaderCircle size={25} className="animate-spin" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </DockIcon>
      )}
      {selectedFiles.length > 0 && (
        <DockIcon>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <BlurFade delay={0} inView yOffset={0}>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedFilesToEmpty()}
                  >
                    <X size={25} />
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
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
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
  );
};

export default GalleryNavbar;
