"use client";
import { api } from "~/trpc/react";
import EmptyPage from "./EmptyPage";
import BlurFade from "~/components/ui/blur-fade";
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
import { ArrowRight, Check, Ellipsis, LoaderCircle, X } from "lucide-react";
import { useParams } from "next/navigation";
import DeleteButton from "./DeleteButton";
import { Skeleton } from "~/components/ui/skeleton";
import { windowSize } from "~/utils/utils";

const AlbumCoverImages: React.FC<{ album: Album }> = ({ album }) => {
  const param = useParams();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { data: albumFiles } = api.file.getAlbumFiles.useQuery({
    id: album.id,
  });
  const displayFiles = albumFiles?.slice(
    0,
    4,
  );
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
      <div className="border rounded-md h-[400px] w-[300px] flex flex-col">
        <div className="absolute right-4 top-2 flex items-center gap-2 bg-transparent">
          <DropdownMenu>
            <DropdownMenuTrigger asChild >
              <Ellipsis fill='white' size={20} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup className="flex flex-col items-center">
                <DropdownMenuItem asChild>
                  <Button
                    onClick={() => {
                      setIsUpdating(true);
                    }}
                    variant='ghost'
                    className="w-full p-0"
                  >
                    {isAlbumUpdatePending ? (
                      <LoaderCircle size={25} className="animate-spin" />
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
        </div>
        <div className={`grid grid-cols-3 w-full h-full p-2`}>
          {displayFiles?.map((displayFile, idx) => (
            <div key={idx} style={{ backgroundImage: `url(${displayFile.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className={`${idx === 0 || idx === 3 ? 'col-span-2' : 'col-span-1'}`}></div>
          ))}
        </div>
        <div className="p-2 flex items-center justify-between">
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
            : <h1>{album.name}</h1>}
          <div className="flex items-center gap-1">
            {isUpdating && <Button
              onClick={() => {
                setIsUpdating(false);
              }}
              className="p-1 h-fit rounded-full">
              <X size={20} />
            </Button>}
            {isUpdating ?
              <Button
                className="p-1 h-fit rounded-full"
                type="submit"
                form="update-album-form"
                disabled={isAlbumUpdatePending}
              >
                {isAlbumUpdatePending ? (
                  <LoaderCircle size={25} className="animate-spin" />
                ) : (
                  <Check size={20} />
                )}
              </Button>
              :
              <Link className="bg-muted rounded-full p-1 group/button" href={`/galleries/${String(param.id)}/albums/${album.id}`}>
                <ArrowRight size={20} className="group-hover/button:-rotate-12 transition-transform duration-300" />
              </Link>
            }
          </div>

        </div>
      </div>
    </BlurFade>
  );
};

const Albums: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const { data: albums, isLoading } = api.album.getAlbums.useQuery({
    id: gallerySlug,
  });

  if (albums?.length === 0)
    return (
      <EmptyPage
        isAlbumOrFilePage={isAlbumOrFileEnum.album}
        gallerySlug={gallerySlug}
      />
    );

  return (
    <div className="container mx-auto my-10">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {isLoading ? Array.from({ length: windowSize(3, 5) }).map((_, idx) => (
          <div className="border rounded-md h-[400px] w-[300px] flex flex-col" key={idx}>
            <div className="p-2 w-full h-full">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex items-center justify-between p-2">
              <Skeleton className="h-5 w-[40px] rounded-xl" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        )) : albums?.map((album) => (
          <AlbumCoverImages key={album.id} album={album} />
        ))}
      </div>
    </div>
  )
};

export default Albums;
