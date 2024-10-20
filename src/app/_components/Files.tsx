"use client";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import BlurFade from "~/components/ui/blur-fade";
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
import EmptyAlbumPage from "./EmptyAlbumPage";
import Video from "./Video";
import { Badge } from "~/components/ui/badge";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Separator } from "~/components/ui/separator";
import { isAlbumOrFileEnum } from "~/types/types";

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
      <EmptyAlbumPage
        gallerySlug={gallerySlug}
        isAlbumOrFilePage={isAlbumOrFileEnum.file}
      />
    );
  return (
    <div className="container mx-auto px-4 py-10">
      {/* <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start"> */}
      {/* {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-48 w-full rounded-lg" />
            ))
          :  */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-center gap-4">
          {files?.map(
            (file) =>
              file.fileType?.includes("image") && (
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
                          <AspectRatio ratio={1 / 1}>
                            <Image
                              src={file.url}
                              alt={`Gallery image ${file.id}`}
                              layout="fill"
                              className={`h-full w-full cursor-pointer rounded-md object-cover transition-transform duration-300 hover:scale-105 ${
                                loadedFiles.has(Number(file.id))
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              onLoadingComplete={() =>
                                handleImageLoad(Number(file.id))
                              }
                            />
                          </AspectRatio>
                        </div>

                        {!loadedFiles.has(Number(file.id)) && (
                          <Skeleton className="h-full w-full rounded-lg" />
                        )}
                      </div>
                    </Link>
                  </div>
                </BlurFade>
              ),
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Badge className="w-fit">Images</Badge>
          <Separator />
          <Badge className="w-fit">Videos</Badge>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {files?.map(
            (file) =>
              file.fileType?.includes("video") && (
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
                        <div className="h-full w-[350px] md:w-[400px]">
                          <Video url={file.url} showInitialPlayButton={false} />
                        </div>

                        {!loadedFiles.has(Number(file.id)) && (
                          <Skeleton className="h-full w-full rounded-lg" />
                        )}
                      </div>
                    </Link>
                  </div>
                </BlurFade>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
