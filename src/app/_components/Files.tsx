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
import { isAlbumOrFileEnum } from "~/types/types";
import { Dot, Earth, LockKeyhole } from "lucide-react";
import { Button } from "~/components/ui/button";
import DeleteButton from "./DeleteButton";
import ToAlbumButton from "./ToAlbumButton";
import { typeOfFile } from "~/utils/utils";
import CircularFilterMenu from "./CircularFilterMenu";

const Files: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  const { data: files, isLoading } = api.file.getFiles.useQuery();
  const [filter, setFilter] = useState<string>("");
  const {
    setSelectedFiles,
    removeSelectedFiles,
    selectedFiles,
    isSelecting,
    setIsSelecting,
    setSelectedFilesToEmpty,
    fileType,
  } = useFileStore();
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
  const isFileSelected = (fileId: string) => {
    return selectedFiles.some((file) => file.id === fileId);
  };
  return isLoading ? (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <Dot size={250} className="animate-bounce" />
    </div>
  ) : (
    <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-10">
      <div className="flex items-center gap-2">
        {selectedFiles.length > 0 ? (
          <div className="flex items-center gap-2 xl:hidden">
            <DeleteButton fileType={fileType} />
            <ToAlbumButton gallerySlug={gallerySlug} />
          </div>
        ) : (
          <CircularFilterMenu setFilter={setFilter} />
        )}
        <Button
          onClick={() => {
            if (isSelecting) {
              setSelectedFilesToEmpty();
              setIsSelecting();
            } else {
              setIsSelecting();
            }
          }}
          className="md:hidden"
          variant="outline"
        >
          {isSelecting ? "Cancel" : "Select"}
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {filter === "All" || filter === ""
          ? files?.map((file, idx) => (
              <BlurFade key={file.id} delay={0.25 + Number(idx) * 0.05} inView>
                <div
                  className={`group relative flex h-full w-full flex-col gap-1 overflow-hidden rounded-lg`}
                >
                  <Checkbox
                    checked={isFileSelected(file.id)}
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
                    className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted ${
                      foundedFileInSelectedFiles(file.id) ? "flex" : "hidden"
                    } group-hover:hidden md:group-hover:flex ${isSelecting && "flex"} `}
                  />
                  <Link href={`/galleries/${gallerySlug}/images/${file.id}`}>
                    <div className="relative h-full w-full">
                      <div className="h-full w-[150px]">
                        {typeOfFile(file.fileType) === "Image" ? (
                          <AspectRatio ratio={1 / 1}>
                            <Image
                              priority
                              src={file.url}
                              alt={`Gallery image ${file.id}`}
                              layout="fill"
                              className={`h-full w-full cursor-pointer rounded-md object-cover shadow transition-transform duration-300 hover:scale-105 ${
                                loadedFiles.has(Number(file.id))
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              onLoadingComplete={() =>
                                handleImageLoad(Number(file.id))
                              }
                            />
                          </AspectRatio>
                        ) : (
                          <Video
                            className="max-h-[150px]"
                            url={file.url}
                            showInitialPlayButton={false}
                          />
                        )}
                      </div>

                      {!loadedFiles.has(Number(file.id)) && (
                        <Skeleton className="h-full w-full rounded-lg" />
                      )}
                    </div>
                  </Link>
                  <div className="flex w-full items-center justify-between px-2">
                    <div>
                      {file.fileType?.includes("image") ? (
                        <Badge>
                          {file.fileType.includes("gif") ? "GIF" : "Image"}
                        </Badge>
                      ) : (
                        <Badge>Video</Badge>
                      )}
                    </div>
                    <div>
                      {file.filePrivacy === "private" ? (
                        <LockKeyhole size={14} />
                      ) : (
                        <Earth size={14} />
                      )}
                    </div>
                  </div>
                </div>
              </BlurFade>
            ))
          : filter === "Images"
            ? files
                ?.filter((file) => file.fileType?.includes("image"))
                .map((file, idx) => (
                  <BlurFade
                    key={file.id}
                    delay={0.25 + Number(idx) * 0.05}
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
                        className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted ${
                          foundedFileInSelectedFiles(file.id)
                            ? "flex"
                            : "hidden"
                        } group-hover:flex`}
                      />
                      <Link
                        href={`/galleries/${gallerySlug}/images/${file.id}`}
                      >
                        <div className="relative h-full w-full">
                          <div className="h-full w-[300px]">
                            <AspectRatio ratio={1 / 1}>
                              <Image
                                priority
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
                      <div className="flex w-full items-center justify-between px-2">
                        <div>
                          {file.fileType?.includes("image") ? (
                            <Badge>
                              {file.fileType.includes("gif") ? "GIF" : "Image"}
                            </Badge>
                          ) : (
                            <Badge>Video</Badge>
                          )}
                        </div>
                        <div>
                          {file.filePrivacy === "private" ? (
                            <LockKeyhole size={14} />
                          ) : (
                            <Earth size={14} />
                          )}
                        </div>
                      </div>
                    </div>
                  </BlurFade>
                ))
            : filter === "Videos" &&
              files
                ?.filter((file) => file.fileType?.includes("video"))
                .map((file, idx) => (
                  <BlurFade
                    key={file.id}
                    delay={0.25 + Number(idx) * 0.05}
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
                        className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted ${
                          foundedFileInSelectedFiles(file.id)
                            ? "flex"
                            : "hidden"
                        } group-hover:flex`}
                      />
                      <Link
                        href={`/galleries/${gallerySlug}/images/${file.id}`}
                      >
                        <div className="relative h-full w-full">
                          <div className="h-full w-[300px]">
                            <Video
                              url={file.url}
                              showInitialPlayButton={false}
                            />
                          </div>
                          {!loadedFiles.has(Number(file.id)) && (
                            <Skeleton className="h-full w-full rounded-lg" />
                          )}
                        </div>
                      </Link>
                      <div className="flex w-full items-center justify-between px-2">
                        <div>
                          {file.fileType?.includes("image") ? (
                            <Badge>
                              {file.fileType.includes("gif") ? "GIF" : "Image"}
                            </Badge>
                          ) : (
                            <Badge>Video</Badge>
                          )}
                        </div>
                        <div>
                          {file.filePrivacy === "private" ? (
                            <LockKeyhole size={14} />
                          ) : (
                            <Earth size={14} />
                          )}
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
