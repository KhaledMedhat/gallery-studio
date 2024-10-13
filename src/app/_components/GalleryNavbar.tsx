"use client";
import Link from "next/link";
import Image from "next/image";
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
import { useImageStore } from "~/store";
import { ToastAction } from "~/components/ui/toast";
import { Input } from "~/components/ui/input";
import AnimatedCircularProgressBar from "~/components/ui/animated-circular-progress-bar";
import { useState } from "react";

const GalleryNavbar: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const router = useRouter();
  const utils = api.useUtils();
  const { data: user } = api.user.getUser.useQuery();
  const { imageUrl, imageKey, isUploading, progress, setImageUrl } =
    useImageStore();
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
      setImageFile(undefined);
      setIsDialogOpen(false);
      form.reset();
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
    <Dock direction="middle" className="">
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground">
                    <Plus className="h-5 w-5" />
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
            {imageFile && imageUrl && progress === 100 ? (
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
                setImageFile={setImageFile}
              />
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
                <Button type="submit">Save</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
