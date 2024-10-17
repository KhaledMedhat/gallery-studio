"use client";
import Link from "next/link";
import Image from "next/legacy/image";
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
  GalleryHorizontalEnd,
  House,
  Library,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import UploadthingButton from "./UploadthingButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { useFileStore } from "~/store";
import { ToastAction } from "~/components/ui/toast";
import { Input } from "~/components/ui/input";
import AnimatedCircularProgressBar from "~/components/ui/animated-circular-progress-bar";
import { useState } from "react";
import Video from "./Video";

const GalleryNavbar: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isFileError, setIsFileError] = useState<boolean>(false);
  const router = useRouter();
  const utils = api.useUtils();
  const { data: user } = api.user.getUser.useQuery();
  const {
    fileUrl,
    fileKey,
    fileType,
    isUploading,
    progress,
    setFileUrl,
    setFileKey,
    selectedFiles,
    setSelectedFilesToEmpty,
  } = useFileStore();
  const formSchema = z.object({
    caption: z.string().min(1, { message: "Caption Cannot be empty." }),
    tags: z
      .string()
      .transform((str) =>
        str
          .split(" ")
          .map((tag) => tag.trim())
          .filter(Boolean),
      )
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      tags: undefined,
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
  const { mutate: addFile, isPending } = api.file.addFile.useMutation({
    onSuccess: () => {
      setFile(undefined);
      setFileUrl("");
      setFileKey("");
      setIsDialogOpen(false);
      form.reset();
      void utils.file.getFiles.invalidate();
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
    if (!file || !fileKey || !fileUrl || !fileType) {
      setIsFileError(true);
    } else {
      addFile({
        url: fileUrl,
        fileKey: fileKey,
        fileType: fileType,
        caption: data.caption,
        tags: data.tags,
        gallerySlug,
      });
    }
  };
  const handleLogout = async () => {
    router.push("/");
    await signOut({ callbackUrl: "/" });
    await deleteCookie();
  };
  return (
    <Dock
      direction="middle"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto mb-4 flex origin-bottom gap-4 rounded-3xl"
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
              <Link href={`/galleries/${gallerySlug}`}>
                <GalleryHorizontalEnd className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Gallery</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>
      <DockIcon>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/galleries/${gallerySlug}/albums`}>
                <Library className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Albums</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DockIcon>

      <DockIcon>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:bg-transparent"
                  >
                    <Plus size={25} />
                    <span className="sr-only">Add Image</span>
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Add Image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
              <DialogDescription>
                Upload a new image to your gallery. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="flex flex-col gap-6">
                  {file && fileUrl && progress === 100 ? (
                    <div className="relative flex flex-col items-center justify-center gap-6">
                      {fileType.includes("video") ? (
                        <Video url={fileUrl} />
                      ) : (
                        <Image
                          src={fileUrl}
                          alt="Profile Picture"
                          width={200}
                          height={200}
                          style={{ objectFit: "cover" }}
                          className="mx-auto rounded-full"
                        />
                      )}
                      <Button
                        className="flex w-full"
                        type="button"
                        onClick={async () => {
                          if (fileKey) {
                            await deleteFileOnServer(fileKey);
                            setFile(undefined);
                            setFileUrl("");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  ) : isUploading && progress !== 0 ? (
                    <AnimatedCircularProgressBar
                      className="m-auto"
                      max={100}
                      min={0}
                      value={progress}
                      gaugePrimaryColor="#171717"
                      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                    />
                  ) : (
                    <UploadthingButton
                      isImageComponent={true}
                      file={file}
                      setFile={setFile}
                      label={"Image"}
                      isFileError={isFileError}
                    />
                  )}

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
                        <FormDescription>Enter image caption.</FormDescription>
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
                <Button type="submit" disabled={isPending || isUploading}>
                  {!isPending ? (
                    "Save"
                  ) : (
                    <LoaderCircle size={25} className="animate-spin" />
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
                      deleteFile({ id: selectedFiles.map((file) => file.id) });
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
