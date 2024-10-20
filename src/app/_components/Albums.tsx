"use client";
import { api } from "~/trpc/react";
import EmptyAlbumPage from "./EmptyAlbumPage";
import BlurFade from "~/components/ui/blur-fade";
import Image from "next/image";
import ImageOptions from "./ImageOptions";
import { isAlbumOrFileEnum } from "~/types/types";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFileStore } from "~/store";
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

const AlbumCoverImage: React.FC<{ albumId: number; albumTitle: string }> = ({
  albumId,
  albumTitle,
}) => {
  const { data: albumFiles } = api.file.getAlbumFiles.useQuery({ id: albumId });
  const displayFiles = [...(albumFiles ?? []), null, null, null, null].slice(
    0,
    4,
  );
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2">
      {displayFiles.map((file, idx) => (
        <div key={file?.id ?? `placeholder-${idx}`}>
          {file ? (
            <Image
              priority
              src={file.url}
              alt={`One of ${albumTitle} album cover images`}
              width={300}
              height={200}
              className="h-auto max-w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <Skeleton className="h-[205.5px] w-full animate-none rounded-lg bg-gradient-to-r from-slate-700" />
          )}
        </div>
      ))}
    </div>
  );
};

const Albums: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const { data: albums } = api.album.getAlbums.useQuery({ id: gallerySlug });
  const { isUpdating } = useFileStore();
  const utils = api.useUtils();

  const formSchema = z.object({
    albumTitle: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   albumTitle: "",
    // },
  });

  const { mutate: updateAlbum, isPending: isAlbumUpdating } =
    api.album.updateAlbum.useMutation({
      onSuccess: () => {
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
  const onSubmit = (data: z.infer<typeof formSchema>, id: number) => {
    if (data.albumTitle) {
      updateAlbum({
        id,
        title: data.albumTitle,
      });
    }
  };
  if (albums?.length === 0) return <EmptyAlbumPage isAlbumOrFilePage={isAlbumOrFileEnum.album} gallerySlug={gallerySlug} />;
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
        {albums?.map((album) => (
          <BlurFade key={album.id} delay={0.6} inView>
            <Link href={`/galleries/${gallerySlug}/albums/${album.id}`}>
              <div className="relative flex h-fit w-[320px] max-w-[320px] flex-col gap-4 rounded-lg border p-4 shadow-sm">
                <div className="absolute right-0 top-0">
                  <ImageOptions
                    isAlbumUpdating={isAlbumUpdating}
                    isAlbumOrFile={isAlbumOrFileEnum.album}
                    albumId={album.id}
                    fileId={null}
                    fileKey={null}
                    fileCaption={null}
                  />
                </div>
                <div className="text-center">
                  {isUpdating ? (
                    <Form {...form}>
                      <form
                        id="update-album-form"
                        onSubmit={form.handleSubmit((data) =>
                          onSubmit(data, album.id),
                        )}
                        className="w-full"
                      >
                        <div className="flex flex-col gap-6">
                          <FormField
                            control={form.control}
                            name="albumTitle"
                            render={({ field }) => {
                              field.value = album.name;
                              return (
                                <FormItem onClick={(e) => e.preventDefault()}>
                                  <FormControl>
                                    <Input
                                      placeholder="Caption of the image"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Update album title
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <h1 className="text-xl font-bold">{album.name}</h1>
                  )}
                </div>
                <AlbumCoverImage albumId={album.id} albumTitle={album.name} />
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default Albums;
