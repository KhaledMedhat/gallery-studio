import Image from "next/legacy/image";
import { X, LoaderCircle, ImagePlus } from "lucide-react";
import AnimatedCircularProgressBar from "~/components/ui/animated-circular-progress-bar";
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { deleteFileOnServer } from "../actions";
import UploadthingButton from "./UploadthingButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { useTheme } from "next-themes";
import type { fileType } from "~/types/types";
import Video from "./Video";
import { Switch } from "~/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const AddFileButton: React.FC<{
  files?: fileType[] | undefined;
  isEmptyPage?: boolean;
  albumId?: string;
  gallerySlug: string;
  isTabs?: boolean;
}> = ({ files, gallerySlug, isEmptyPage, isTabs, albumId }) => {
  console.log(gallerySlug)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isFileError, setIsFileError] = useState<boolean>(false);
  const theme = useTheme();
  const {
    fileUrl,
    fileKey,
    fileType,
    isUploading,
    progress,
    setFileUrl,
    setFileKey,
  } = useFileStore();
  const utils = api.useUtils();
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
      .refine((tags) => tags.every((tag) => tag.startsWith("#")), {
        message: "Each tag must start with #",
      })
      .refine(
        (tags) =>
          tags.every((tag) => tag.indexOf("#") === tag.lastIndexOf("#")),
        {
          message: "Tags cannot contain more than one #",
        },
      )
      .optional(),
    privacy: z.boolean().default(false)
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      tags: undefined,
      privacy: false
    },
  });
  const { mutate: addToExistedAlbum, isPending: isAddToExistingAlbumPending } = api.album.addToAlbum.useMutation({
    onSuccess: () => {
      toast({
        title: "Added Successfully.",
        description: `Images has been added successfully.`,
      });
      void utils.file.getAlbumFiles.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Uh oh! Something went wrong. Please try again.`,
      });
    },
  });
  const { mutate: addFile, isPending } = api.file.addFile.useMutation({
    onSuccess: (data) => {
      setFile(undefined);
      setFileUrl("");
      setFileKey("");
      setIsDialogOpen(false);
      form.reset();
      void utils.file.getFiles.invalidate();
      toast({
        description: <span>Your {data?.fileType?.includes('image') ? data.fileType.includes("gif") ? "GIF" : "Image" : "Video"} has been added successfully</span>,
      });
      if (isTabs && data) {
        addToExistedAlbum({ id: [data.id], albumId: Number(albumId) })

      }
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
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
        filePrivacy: data.privacy ? 'public' : 'private',
        caption: data.caption,
        tags: data.tags,
        gallerySlug,
      });
    }
  };


  if (isTabs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Image , Video or GIF</CardTitle>
          <CardDescription>
            Upload a new image , video or even GIF to your gallery. Click save when you&apos;re
            done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form
              id="add-image-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              <div className="flex flex-col gap-6">
                {file && fileUrl && progress === 100 ? (
                  <div className="relative flex flex-col items-center justify-center gap-6">
                    {fileType.includes("video") ? (
                      <Video url={fileUrl} />
                    ) : (
                      <AspectRatio ratio={1 / 1}>
                        <Image
                          src={fileUrl}
                          alt="Profile Picture"
                          layout="fill"
                          className="h-full w-full cursor-pointer rounded-full object-cover"
                        />
                      </AspectRatio>
                    )}
                    <Button
                      className="absolute right-0 top-0"
                      type="button"
                      variant="ghost"
                      onClick={async () => {
                        if (fileKey) {
                          await deleteFileOnServer(fileKey);
                          setFile(undefined);
                          setFileUrl("");
                        }
                      }}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                ) : isUploading && progress !== 0 ? (
                  <AnimatedCircularProgressBar
                    className="m-auto"
                    max={100}
                    min={0}
                    value={progress}
                    gaugePrimaryColor={
                      theme.resolvedTheme === "dark" ? "#d4d4d4" : "#171717"
                    }
                    gaugeSecondaryColor={
                      theme.resolvedTheme === "dark" ? "#171717" : "#d4d4d4"
                    }
                  />
                ) : (
                  <UploadthingButton
                    isImageComponent={true}
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
                      <FormLabel>Caption *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Caption of the image" {...field} />
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
                {file &&
                  <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-1 justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{fileType.includes('image') ? "Image Privacy" : "Video Privacy"}</FormLabel>
                          <FormDescription>
                            By default it sets to private but you can change it to public.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                }
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            form="add-image-form"
            type="submit"
            className="w-full"
            disabled={isPending || isUploading || isAddToExistingAlbumPending}
          >
            {!isPending || !isAddToExistingAlbumPending || !isUploading ? (
              "Save"
            ) : (
              <LoaderCircle size={20} className="animate-spin" />
            )}
          </Button>
        </CardFooter>
      </Card>

    )
  }

  return (

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {isEmptyPage ? <Button variant="outline">Add Image or Video</Button> :
                <Button variant="ghost">
                  <ImagePlus
                    size={25}
                    className={`${files && files?.length === 0 && "animate-bounce"}`} />

                  <span className="sr-only">Add Image</span>
                </Button>
              }
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Add Image , Video or GIF</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="h-fit max-h-full overflow-y-auto max-w-2xl xl:max-w-fit">
        <DialogHeader>
          <DialogTitle>Add Image , Video or GIF</DialogTitle>
          <DialogDescription>
            Upload a new image , video or even GIF to your gallery. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-image-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col gap-6">
              {file && fileUrl && progress === 100 ? (
                <div className="relative flex flex-col items-center justify-center gap-6">
                  {fileType.includes("video") ? (
                    <Video url={fileUrl} />
                  ) : (
                    <AspectRatio ratio={1 / 1}>
                      <Image
                        src={fileUrl}
                        alt="Profile Picture"
                        layout="fill"
                        className="h-full w-full cursor-pointer rounded-full object-cover"
                      />
                    </AspectRatio>
                  )}
                  <Button
                    className="absolute right-0 top-0"
                    type="button"
                    variant="ghost"
                    onClick={async () => {
                      if (fileKey) {
                        await deleteFileOnServer(fileKey);
                        setFile(undefined);
                        setFileUrl("");
                      }
                    }}
                  >
                    <X size={20} />
                  </Button>
                </div>
              ) : isUploading && progress !== 0 ? (
                <AnimatedCircularProgressBar
                  className="m-auto"
                  max={100}
                  min={0}
                  value={progress}
                  gaugePrimaryColor={
                    theme.resolvedTheme === "dark" ? "#d4d4d4" : "#171717"
                  }
                  gaugeSecondaryColor={
                    theme.resolvedTheme === "dark" ? "#171717" : "#d4d4d4"
                  }
                />
              ) : (
                <UploadthingButton
                  isImageComponent={true}
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
                    <FormLabel>Caption *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Caption of the image" {...field} />
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
              {file &&
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-1 justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>{fileType.includes('image') ? "Image Privacy" : "Video Privacy"}</FormLabel>
                        <FormDescription>
                          By default it sets to private but you can change it to public.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              }
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            form="add-image-form"
            type="submit"
            disabled={isPending || isUploading}
          >
            {!isPending ? (
              "Save"
            ) : (
              <LoaderCircle size={20} className="animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileButton;
