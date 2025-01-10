import { zodResolver } from "@hookform/resolvers/zod";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { FolderInput, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BlurFade from "~/components/ui/blur-fade";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "~/hooks/use-toast";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";

const ToAlbumButton: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { selectedFiles } = useFileStore();
  const { data: albums } = api.album.getAlbums.useQuery({ id: gallerySlug });
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
    album: z.string().min(1, { message: "Album name cannot be empty." }),
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
      setIsDialogOpen(false);
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
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
        setIsDialogOpen(false);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "One of the selected images is already in the album.",
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
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <BlurFade delay={0} inView yOffset={0}>
                  <FolderInput size={20} />
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
                                <SelectItem key={album.id} value={album.name}>
                                  {album.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            You can create your albums from the New Album tap on
                            the top right corner or from the albums page.
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
                    <LoaderCircle size={20} className="animate-spin" />
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
                    <LoaderCircle size={20} className="animate-spin" />
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
  );
};

export default ToAlbumButton;
