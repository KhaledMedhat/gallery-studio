"use client";
import { api } from "~/trpc/react";
import EmptyPage from "./EmptyPage";
import BlurFade from "~/components/ui/blur-fade";
import Image from "next/image";
import { isAlbumOrFileEnum } from "~/types/types";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
import { ToastAction } from "~/components/ui/toast";
import { motion } from "framer-motion";
import { Card, CardContent } from "~/components/ui/card";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { EllipsisVertical, LoaderCircle } from "lucide-react";

const AlbumCoverImage: React.FC<{ albumId: number; albumTitle: string }> = ({
  albumId,
  albumTitle,
}) => {
  const { data: albumFiles } = api.file.getAlbumFiles.useQuery({ id: albumId });
  const displayFiles = [...(albumFiles ?? []), null, null, null, null].slice(
    0,
    4,
  );
  const isArrayOfNulls = displayFiles.every((s) => s === null);
  return (
    <div className="relative h-[400px] w-[300px]">
      {displayFiles.map((image, index) => (
        <motion.div
          key={index}
          className="absolute left-7 top-10 h-[280px] w-[220px] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            rotate: (index - 0.5) * 25,
            scale: 0.9 + index * 0.03,
            x: (index - 0.5) * 40,
            y: (index - 0.5) * 40,
            zIndex: displayFiles.length - index,
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        >
          <Card className="h-full w-full overflow-hidden shadow-md">
            <CardContent className="p-2">
              <div className="relative h-[220px] w-full overflow-hidden">
                {image ? (
                  <Image
                    src={image.url}
                    alt={`${albumTitle} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-gray-400">
                    {isArrayOfNulls
                      ? ` Nothing in ${albumTitle} album yet`
                      : `Image ${index} out of ${displayFiles.length} cover images  add some to make ur album cover`}
                  </div>
                )}
              </div>
              <div className="mt-2 h-6 w-full bg-primary">
                <div className="h-full w-1/3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const Albums: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const { data: albums } = api.album.getAlbums.useQuery({ id: gallerySlug });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentAlbumTitle, setCurrentAlbumTitle] = useState<string>("");
  const [currentAlbumId, setCurrentAlbumId] = useState<number | null>(null);
  const utils = api.useUtils();

  const formSchema = z.object({
    albumTitle: z.string().min(1, { message: "Album name cannot be empty." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      albumTitle: currentAlbumTitle,
    },
  });

  const { mutate: deleteAlbum, isPending: isAlbumDeleting } =
    api.album.deleteAlbum.useMutation({
      onSuccess: () => {
        toast({
          title: "Deleted Successfully.",
          description: `Album has been deleted successfully.`,
        });
        void utils.album.getAlbums.invalidate();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Deleting Album Failed.",
          description: `Uh oh! Something went wrong. Please try again.`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
    });
  const { mutate: updateAlbum, isPending: isAlbumUpdatePending } =
    api.album.updateAlbum.useMutation({
      onSuccess: () => {
        toast({
          title: "Updated Successfully.",
          description: `Album title has been updated successfully.`,
        });
        setIsUpdating(false);
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

  useEffect(() => {
    if (isUpdating && currentAlbumId !== null) {
      const album = albums?.find((album) => album.id === currentAlbumId);
      if (album) {
        // Reset form when edit is clicked, and fill the input with the album title
        form.reset({ albumTitle: album.name });
      }
    }
  }, [isUpdating, currentAlbumId, albums, form]);
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (currentAlbumId !== null) {
      if (data.albumTitle) {
        updateAlbum({
          id: currentAlbumId,
          title: data.albumTitle,
        });
      }
    }
  };
  if (albums?.length === 0)
    return (
      <EmptyPage
        isAlbumOrFilePage={isAlbumOrFileEnum.album}
        gallerySlug={gallerySlug}
      />
    );
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
        {albums?.map((album) => (
          <BlurFade key={album.id} delay={0.6} inView>
            <div className="relative flex h-[480px] w-[400px] max-w-full flex-col gap-4 rounded-xl border p-4 shadow-lg">
              <div className="absolute right-0 top-3">
                {!isUpdating ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hover:bg-transparent">
                        <EllipsisVertical size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="p-0">
                          <Button
                            onClick={() => {
                              setCurrentAlbumTitle(album.name);
                              setCurrentAlbumId(album.id);
                              setIsUpdating(true);
                            }}
                            variant="ghost"
                            className="w-full hover:bg-transparent"
                          >
                            {isAlbumUpdatePending ? (
                              <LoaderCircle
                                size={25}
                                className="animate-spin"
                              />
                            ) : (
                              "Edit"
                            )}
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0">
                          <Button
                            disabled={isAlbumDeleting}
                            onClick={async () => {
                              deleteAlbum({ id: album.id });
                            }}
                            variant="ghost"
                            className="w-full text-destructive hover:bg-transparent hover:text-[#d33939]"
                          >
                            {isAlbumDeleting ? (
                              <LoaderCircle
                                size={25}
                                className="animate-spin"
                              />
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      form="update-album-form"
                      disabled={isAlbumUpdatePending}
                    >
                      {isAlbumUpdatePending ? (
                        <LoaderCircle size={25} className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsUpdating(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <div>
                {isUpdating ? (
                  <Form {...form}>
                    <form
                      id="update-album-form"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-full"
                    >
                      <div className="flex flex-col gap-6">
                        <FormField
                          control={form.control}
                          name="albumTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-[200px]"
                                  placeholder="Album title"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Update album title
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                ) : (
                  <h1 className="text-center text-xl font-bold">
                    {album.name}
                  </h1>
                )}
              </div>
              <Link href={`/galleries/${gallerySlug}/albums/${album.id}`}>
                <AlbumCoverImage albumId={album.id} albumTitle={album.name} />
              </Link>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default Albums;
