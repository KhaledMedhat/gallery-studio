"use client";
import { api } from "~/trpc/react";
import EmptyPage from "./EmptyPage";
import BlurFade from "~/components/ui/blur-fade";
import Image from "next/image";
import { type Album, isAlbumOrFileEnum } from "~/types/types";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Dot, EllipsisVertical, LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import DeleteButton from "./DeleteButton";

const AlbumCoverImages: React.FC<{ album: Album }> = ({
  album,
}) => {
  const param = useParams()
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
      albumTitle: album.name,
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
        });
      },
    });

  useEffect(() => {
    form.reset({ albumTitle: album.name });
  }, [album, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const isChanged = data.albumTitle !== album.name;
    if (!isChanged) {
      setIsUpdating(false);
      toast({
        description: `No changes made.`,
      });
    } else {
      if (data.albumTitle) {
        updateAlbum({
          id: album.id,
          title: data.albumTitle,
        });
      }
    }


  };

  return (
    <BlurFade delay={0.6} inView>
      <div className="relative border w-[400px] h-[200px] xl:w-[500px] xl:h-[300px] rounded-lg">
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {!isUpdating ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-transparent hover:text-accent p-0 text-accent z-30">
                  <EllipsisVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup className="flex flex-col items-center">
                  <DropdownMenuItem className="p-0">
                    <Button
                      onClick={() => {
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
                  <DropdownMenuItem className="p-0" asChild>
                    <DeleteButton albumId={album.id} isAlbum={true} />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 z-30">
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
        <Link href={`/galleries/${String(param.id)}/albums/${album.id}`}>
          <div className="group/album w-full h-full absolute z-20 flex items-center justify-center bg-black/25 rounded-lg">
            {isUpdating ?
              <Form {...form}>
                <form
                  id="update-album-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="albumTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              onClick={(e) => e.preventDefault()}
                              placeholder="Album title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
              :
              <div className="transition-transform duration-300 group-hover/album:scale-125">
                <h1 className="text-3xl font-bold text-accent ">
                  {album.name}
                </h1>
              </div>
            }

          </div>
          {isArrayOfNulls ? <div className="w-full h-full flex justify-center gap-2 bg-accent-foreground rounded-lg">

          </div> :
            <div
              className={`grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(2,1fr)] gap-[1px] w-full h-full shadow
                        [&>*:nth-child(1)]:col-span-2 [&>*:nth-child(1)]:rounded-tl-lg
                        [&>*:nth-child(2)]:col-start-3 [&>*:nth-child(2)]:rounded-tr-lg
                        [&>*:nth-child(3)]:row-start-2 [&>*:nth-child(3)]:rounded-bl-lg
                        [&>*:nth-child(4)]:col-span-2  [&>*:nth-child(4)]:row-start-2 [&>*:nth-child(4)]:rounded-br-lg
                        `}>

              {displayFiles.map((file, idx) => (
                file ? <div key={idx} className="relative w-full h-full overflow-hidden">
                  <Image src={file?.url ?? ''} alt={`One of ${album.name}'s images`} width={100} height={100} className="w-full h-full blur-[1px] object-cover" />
                </div> :
                  <div key={idx} className="bg-accent-foreground">
                  </div>
              ))}
            </div>
          }

        </Link>
      </div>
    </BlurFade>
  )
};

const Albums: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const { data: albums, isLoading } = api.album.getAlbums.useQuery({ id: gallerySlug });

  if (albums?.length === 0)
    return (
      <EmptyPage
        isAlbumOrFilePage={isAlbumOrFileEnum.album}
        gallerySlug={gallerySlug}
      />
    );

  return (
    isLoading ? (<div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <Dot size={250} className="animate-bounce" />
    </div>)
      :
      (<div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          {albums?.map((album) => (
            <AlbumCoverImages key={album.id} album={album} />
          ))}
        </div>
      </div>)
  );
};

export default Albums;
