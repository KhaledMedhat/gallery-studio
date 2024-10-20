"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LoaderCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ToastAction } from "~/components/ui/toast";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { isAlbumOrFileEnum } from "~/types/types";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import AnimatedCircularProgressBar from "~/components/ui/animated-circular-progress-bar";
import { deleteFileOnServer } from "../actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Textarea } from "~/components/ui/textarea";
import UploadthingButton from "./UploadthingButton";
import { useFileStore } from "~/store";
import { useState } from "react";
import BlurFade from "~/components/ui/blur-fade";

const EmptyAlbumPage: React.FC<{
  gallerySlug: string;
  isAlbumOrFilePage: isAlbumOrFileEnum;
}> = ({ gallerySlug, isAlbumOrFilePage }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isFileError, setIsFileError] = useState<boolean>(false);
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

  const filesFormSchema = z.object({
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
  });

  const fileForm = useForm<z.infer<typeof filesFormSchema>>({
    resolver: zodResolver(filesFormSchema),
    defaultValues: {
      caption: "",
      tags: undefined,
    },
  });
  const formSchema = z.object({
    albumTitle: z.string().min(1, { message: "Album name Cannot be empty." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      albumTitle: "",
    },
  });
  const { mutate: addAlbum, isPending: isAddFilePending } =
    api.album.createAlbum.useMutation({
      onSuccess: () => {
        form.reset();
        void utils.album.getAlbums.invalidate();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
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
  const onFileSubmit = (data: z.infer<typeof filesFormSchema>) => {
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
  const justText =
    isAlbumOrFilePage === isAlbumOrFileEnum.album ? (
      <h1 className="w-1/2 text-center text-2xl leading-relaxed tracking-wide">
        No Albums, add one to get started and save your lovely moments in it,
        click the button below
      </h1>
    ) : (
      <h1 className="w-3/5 text-center text-2xl leading-relaxed tracking-wide">
        No Images or Videos in your gallery, hurry up and add some and save your
        moments, click the button below
      </h1>
    );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addAlbum({
      title: data.albumTitle,
      id: gallerySlug,
    });
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {isAlbumOrFilePage === isAlbumOrFileEnum.album ? (
        <BlurFade delay={0.6} inView>
          <div className="flex flex-col items-center gap-4">
            {justText}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Album</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Album</DialogTitle>
                  <DialogDescription>
                    Make your albums stand out with a Title , Images and Videos.
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
                  <Button form="album-id" type="submit">
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </BlurFade>
      ) : (
        <BlurFade delay={0.6} inView>
          <div className="flex flex-col items-center gap-4">
            {justText}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Image or Video</Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Add Image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DialogContent className="h-full max-h-[800px] overflow-y-auto sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Image</DialogTitle>
                  <DialogDescription>
                    Upload a new image to your gallery. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>

                <Form {...fileForm}>
                  <form
                    onSubmit={fileForm.handleSubmit(onFileSubmit)}
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
                        control={fileForm.control}
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
                        control={fileForm.control}
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
                    <Button
                      type="submit"
                      disabled={isAddFilePending || isUploading}
                    >
                      {!isAddFilePending ? (
                        "Save"
                      ) : (
                        <LoaderCircle size={25} className="animate-spin" />
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </BlurFade>
      )}
    </div>
  );
};

export default EmptyAlbumPage;
