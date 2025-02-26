import { LoaderCircle, ImagePlus, X } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import type { fileType } from "~/types/types";
import { Switch } from "~/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { prepareFileForUpload, typeOfFile } from "~/utils/utils";
import { useUploader } from "~/hooks/useUploader";

const AddFileButton: React.FC<{
  files?: fileType[] | undefined;
  isEmptyPage?: boolean;
  albumId?: string;
  gallerySlug: string;
  isTabs?: boolean;
}> = ({ files, gallerySlug, isEmptyPage, isTabs, albumId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();
  const { fileKey, isUploading, setFileUrl, setFileKey, isUploadedShowcaseEditing, croppedImage, showcaseOriginalName, setFormData } = useFileStore();
  const utils = api.useUtils();
  const formSchema = z.object({
    showcaseFile: z.object(
      {
        url: z.string(),
        type: z.string(),
      },
      { message: "Please select an image, video or GIF." },
    ),
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
    privacy: z.boolean().default(false),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      showcaseFile: undefined,
      caption: "",
      tags: undefined,
      privacy: false,
    },
  });
  const showcaseUrl = form.watch("showcaseFile");
  const { mutate: addToExistedAlbum, isPending: isAddToExistingAlbumPending } =
    api.album.addToAlbum.useMutation({
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
  const { mutate: addShowcase, isPending } = api.file.addFile.useMutation({
    onSuccess: (data) => {
      setFileUrl("");
      setFileKey("");
      form.setValue("showcaseFile", { url: "", type: "" });
      setIsDialogOpen(false);
      form.reset();
      router.refresh();
      void utils.file.getFiles.invalidate();
      if (data?.filePrivacy === "public")
        void utils.file.getShowcaseFiles.invalidate();
      toast({
        description: (
          <span>
            Your {typeOfFile(data?.fileType)} has been added successfully
          </span>
        ),
      });
      if (isTabs && data) {
        addToExistedAlbum({ id: [data.id], albumId: Number(albumId) });
      }
    },
    onError: async (e) => {
      await deleteFileOnServer(fileKey);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    },
  });
  const { startUpload, getDropzoneProps } = useUploader(
    form,
    undefined,
    addShowcase,
    undefined,
    undefined,
  );
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setFormData({
      filePrivacy: data.privacy,
      caption: data.caption,
      tags: data.tags,
      gallerySlug,
    });
    await prepareFileForUpload(showcaseUrl ?? data.showcaseFile, croppedImage, showcaseOriginalName, isUploadedShowcaseEditing, startUpload);
  };
  const renderContent = () => (
    <Form {...form}>
      <form
        id="add-image-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-fit max-h-full w-full space-y-8 overflow-y-auto"
      >
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="showcaseFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Showcase *</FormLabel>
                <FormControl>
                  {typeOfFile(showcaseUrl?.type) === "Video" ? (
                    <div className="relative">
                      <div className="absolute right-0 top-0 z-10">
                        <Button
                          type="button"
                          className="py-0 hover:bg-transparent"
                          onClick={async () => {
                            form.unregister("showcaseFile");
                            await form.trigger("showcaseFile");
                          }}
                        >
                          <X size={30} />
                        </Button>
                      </div>

                      <UploadthingButton
                        getDropzoneProps={getDropzoneProps}
                        isImageComponent={true}
                        field={field}
                        form={form}
                        isProfile={false}
                        isCircle={false}
                      />
                    </div>
                  ) : (
                    <UploadthingButton
                      getDropzoneProps={getDropzoneProps}
                      isImageComponent={true}
                      field={field}
                      form={form}
                      isProfile={false}
                      isCircle={false}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Caption *</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none rounded-none border-0 border-b focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <FormItem className="space-y-1">
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-none border-0 border-b focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="#tags"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter showcase tags to be searched by it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {showcaseUrl?.url && (
            <FormField
              control={form.control}
              name="privacy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Showcase Privacy</FormLabel>
                    <FormDescription>
                      By default it sets to private but you can change it to
                      public.
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
          )}
        </div>
      </form>
    </Form>
  );

  return isTabs ? (
    <Card>
      <CardHeader>
        <CardTitle>Add Image , Video or GIF</CardTitle>
        <CardDescription>
          Upload a new image , video or even GIF to your gallery. Click save
          when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      <CardFooter>
        <Button
          form="add-image-form"
          type="submit"
          className="w-full"
          disabled={isPending || isUploading || isAddToExistingAlbumPending}
        >
          {isPending || isAddToExistingAlbumPending || isUploading ? (
            <div className="flex items-center justify-center gap-1">
              <LoaderCircle size={20} className="animate-spin" />
              {isUploading && "Uploading ..."}
              {isAddToExistingAlbumPending ||
                (isPending && "Adding your showcase ...")}
            </div>
          ) : (
            "Save"
          )}
        </Button>
      </CardFooter>
    </Card>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {isEmptyPage ? (
                <Button variant="outline">Add Showcase</Button>
              ) : (
                <Button variant="ghost">
                  <ImagePlus
                    size={25}
                    className={`${files && files?.length === 0 && "animate-bounce"}`}
                  />

                  <span className="sr-only">Add Showcase</span>
                </Button>
              )}
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Add Showcase</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="h-fit max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Showcase</DialogTitle>
          <DialogDescription>
            Upload a new image , video or even GIF as a showcase to your
            gallery. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          <Button
            form="add-image-form"
            type="submit"
            disabled={isPending || isUploading}
          >
            {isPending || isUploading ? (
              <div className="flex items-center justify-center gap-1">
                <LoaderCircle size={20} className="animate-spin" />
                {isUploading && "Uploading ..."}
                {isPending && "Adding your showcase ..."}
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFileButton;
