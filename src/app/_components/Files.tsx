"use client";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import BlurFade from "~/components/ui/blur-fade";
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
import EmptyPage from "./EmptyPage";
import Video from "./Video";
import { Badge } from "~/components/ui/badge";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Separator } from "~/components/ui/separator";
import { isAlbumOrFileEnum } from "~/types/types";
import { Dot, Earth, LockKeyhole } from "lucide-react";

const Files: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const { data: files, isLoading } = api.file.getFiles.useQuery();
  const { setSelectedFiles, removeSelectedFiles, selectedFiles } =
    useFileStore();
  function foundedFileInSelectedFiles(id: string) {
    const isFoundedFile = selectedFiles.find((file) => file.id === id);
    return isFoundedFile;
  }

  const [loadedFiles, setLoadedFiles] = useState<Set<number>>(new Set());
  const handleImageLoad = (id: number) => {
    setLoadedFiles((prev) => new Set(prev).add(id));
  };
  if (files?.length === 0)
    return (
      <EmptyPage
        gallerySlug={gallerySlug}
        isAlbumOrFilePage={isAlbumOrFileEnum.file}
      />
    );
  return isLoading ? (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <Dot size={250} className="animate-bounce" />
    </div>
  ) : (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {files?.map((file) => (
          <BlurFade
            key={file.id}
            delay={0.25 + Number(file.id) * 0.05}
            inView
          >
            <div
              className={`group relative h-full w-full overflow-hidden rounded-lg`}
            >
              <Checkbox
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFiles({
                      id: file.id,
                      fileKey: file.fileKey ?? "",
                    });
                  } else {
                    removeSelectedFiles({
                      id: file.id,
                      fileKey: file.fileKey ?? "",
                    });
                  }
                }}
                className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted ${foundedFileInSelectedFiles(file.id) ? "flex" : "hidden"} group-hover:flex`}
              />
              <Link href={`/galleries/${gallerySlug}/images/${file.id}`}>
                <div className="relative h-full w-full">
                  <div className="h-full w-[300px]">
                    {file.fileType?.includes('image') ?
                      <AspectRatio ratio={1 / 1}>
                        <Image
                          priority
                          src={file.url}
                          alt={`Gallery image ${file.id}`}
                          layout="fill"
                          className={`h-full w-full cursor-pointer rounded-md object-cover transition-transform duration-300 hover:scale-105 ${loadedFiles.has(Number(file.id))
                            ? "opacity-100"
                            : "opacity-0"
                            }`}
                          onLoadingComplete={() =>
                            handleImageLoad(Number(file.id))
                          }
                        />
                      </AspectRatio>
                      :
                      <Video url={file.url} showInitialPlayButton={false} />
                    }
                  </div>

                  {!loadedFiles.has(Number(file.id)) && (
                    <Skeleton className="h-full w-full rounded-lg" />
                  )}
                </div>
              </Link>
              <div className="w-full flex items-center justify-between px-2">
                <div>
                  {file.fileType?.includes('image') ? (
                    <Badge
                    >
                      {file.fileType.includes('gif') ? 'GIF' : 'Image'}
                    </Badge>
                  ) :
                    <Badge
                    >
                      Video
                    </Badge>
                  }
                </div>
                <div>
                  {file.filePrivacy === 'private' ? <LockKeyhole size={14} /> : <Earth size={14} />}
                </div>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>

  );
};

export default Files;
