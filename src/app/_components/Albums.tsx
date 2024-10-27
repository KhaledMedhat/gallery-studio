"use client";
import { api } from "~/trpc/react";
import EmptyPage from "./EmptyPage";
import BlurFade from "~/components/ui/blur-fade";
import Image from "next/image";
import { Album, isAlbumOrFileEnum } from "~/types/types";
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
import AvatarCircles from "~/components/ui/avatar-circles";

const AlbumCoverImages: React.FC<{ album: Album, gallerySlug: string }> = ({
  album,
  gallerySlug
}) => {
  const [currentAlbumTitle, setCurrentAlbumTitle] = useState<string>("");
  const [currentAlbumId, setCurrentAlbumId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { data: albumFiles } = api.file.getAlbumFiles.useQuery({ id: album.id });
  const displayFiles = [...(albumFiles ?? []), null, null, null, null].slice(
    0,
    4,
  );
  const isArrayOfNulls = displayFiles.every((s) => s === null);
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

  // useEffect(() => {
  //   if (isUpdating && currentAlbumId !== null) {
  //     const albumB = albums?.find((album) => album.id === currentAlbumId);
  //     if (albumB) {
  //       // Reset form when edit is clicked, and fill the input with the album title
  //       form.reset({ albumTitle: albumB.name });
  //     }
  //   }
  // }, [isUpdating, currentAlbumId, albums, form]);
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

  return (

    <BlurFade delay={0.6} inView>
      <div className="relative border w-[400px] h-[300px] rounded-lg">
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {!isUpdating ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-transparent p-0">
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

        {isUpdating ? (
          <div className="flex items-center justify-center w-full h-full">
            <Form {...form}>
              <form
                id="update-album-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className=""
              >
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="albumTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            onClick={(e) => e.stopPropagation()}
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
          </div>
        ) : (
          <Link href={`/galleries/${gallerySlug}/albums/${album.id}`}>
            <div className="bg-red-500 absolute z-10 inset-0  w-fit h-fit">
              <h1 className="text-xl font-bold  ">
                {album.name}
              </h1>
            </div>
            <div
              className={`grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(2,1fr)] gap-0; w-full h-full rounded-lg shadow
                    [&>*:nth-child(1)]:col-span-2
                [&>*:nth-child(2)]:col-start-3
                [&>*:nth-child(3)]:row-start-2
                [&>*:nth-child(4)]:col-span-2  [&>*:nth-child(4)]:row-start-2
                overflow-hidden`}>

              {displayFiles.map((file, idx) => (
                file ? <div key={idx} className=" w-full h-full">
                  <Image src={file?.url ?? ''} alt={`One of ${album.name}'s images`} width={100} height={100} className="w-full h-full blur-[1px]" />
                </div> :
                  <div key={idx} className="bg-gray-600 blur-[1px]">
                    {/* <h1>nothing yet</h1> */}
                  </div>
              ))}
            </div>
          </Link>
        )}
      </div>
    </BlurFade>
  )
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
          <AlbumCoverImages key={album.id} album={album} gallerySlug={gallerySlug} />
        ))}
      </div>
    </div>
  );
};

export default Albums;
