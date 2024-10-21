"use client";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import BlurFade from "~/components/ui/blur-fade";
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";
import { useFileStore } from "~/store";
import { api } from "~/trpc/react";
import EmptyAlbumPage from "./EmptyPage";
import Video from "./Video";
import { Badge } from "~/components/ui/badge";

const Images: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const { data: files, isLoading } = api.file.getFiles.useQuery();
  console.log(files);
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
  if (files?.length === 0) return <EmptyAlbumPage gallerySlug={gallerySlug} />;
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {/* {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-48 w-full rounded-lg" />
            ))
          :  */}
        {files?.map((file) => (
          <BlurFade key={file.id} delay={0.25 + Number(file.id) * 0.05} inView>
            <div className="flex flex-col gap-2">
              <Badge className="w-fit">
                {file.fileType?.includes("video") ? "Video" : "Image"}
              </Badge>
              <div
                className={`group relative overflow-hidden rounded-lg ${file.fileType?.includes("video") ? "col-span-2 aspect-video h-full w-full" : "aspect-square"}`}
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
                    {file.fileType?.includes("video") ? (
                      <Video url={file.url} showInitialPlayButton={false} />
                    ) : (
                      <Image
                        src={file.url}
                        alt={`Gallery image ${file.id}`}
                        layout="fill"
                        objectFit="cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`cursor-pointer transition-transform duration-300 hover:scale-105 ${
                          loadedFiles.has(Number(file.id))
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        onLoadingComplete={() =>
                          handleImageLoad(Number(file.id))
                        }
                      />
                    )}
                    {!loadedFiles.has(Number(file.id)) && (
                      <Skeleton className="h-full w-full rounded-lg" />
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default Images;
