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
import { type fileType, isAlbumOrFileEnum } from "~/types/types";
import { Earth, LockKeyhole } from "lucide-react";
import { Button } from "~/components/ui/button";
import DeleteButton from "./DeleteButton";
import ToAlbumButton from "./ToAlbumButton";
import { typeOfFile, windowSize } from "~/utils/utils";
import CircularFilterMenu from "./CircularFilterMenu";

const Files: React.FC<{
  gallerySlug?: string;
  isAlbum: boolean;
  albumId?: string;
}> = ({ gallerySlug, isAlbum, albumId }) => {
  const { data: albumFilesData, isLoading: isAlbumFilesLoading } =
    api.album.getAlbumById.useQuery(
      {
        id: Number(albumId),
      },
      { enabled: isAlbum },
    );
  const flattedAlbumFiles = albumFilesData?.albumFiles.flatMap(
    (albumFiles) => albumFiles.files,
  );
  const { data: files, isLoading } = api.file.getFiles.useQuery();
  const [filter, setFilter] = useState<string>("All");
  const {
    setSelectedFiles,
    removeSelectedFiles,
    selectedFiles,
    isSelecting,
    setIsSelecting,
    setSelectedFilesToEmpty,
    fileType,
  } = useFileStore();
  const foundedFileInSelectedFiles = (id: string) => {
    const isFoundedFile = selectedFiles.find((file) => file.id === id);
    return isFoundedFile;
  };
  const isFileSelected = (fileId: string) => {
    return selectedFiles.some((file) => file.id === fileId);
  };
  const filteredFiles =
    filter === "All"
      ? isAlbum
        ? flattedAlbumFiles
        : files
      : isAlbum
        ? flattedAlbumFiles?.filter((file) =>
          filter === "Images"
            ? file.fileType?.includes("image")
            : filter === "GIF"
              ? file.fileType?.includes("gif")
              : file.fileType?.includes("video"),
        )
        : files?.filter((file) =>
          filter === "Images"
            ? file.fileType?.includes("image")
            : filter === "GIF"
              ? file.fileType?.includes("gif")
              : file.fileType?.includes("video"),
        );

  const renderFile = (file: fileType, idx: number) => (
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
          className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted ${foundedFileInSelectedFiles(file.id) ? "flex" : "hidden"
            } ${isSelecting ? "flex" : "group-hover:hidden md:group-hover:flex"} `}
        />
        <Link href={`/galleries/${gallerySlug}/images/${file.id}`}>
          <div className="relative h-full w-full">
            <div className="h-full w-[80px] md:w-[150px]">
              {typeOfFile(file.fileType) === "Image" ? (
                <AspectRatio ratio={1 / 1}>
                  <Image
                    priority
                    src={file.url}
                    alt={`Gallery image ${file.id}`}
                    layout="fill"
                    className={`h-full w-full cursor-pointer rounded-md object-cover shadow transition-transform duration-300 hover:scale-105`}
                  />
                </AspectRatio>
              ) : (
                <Video
                  className="max-h-[80px] md:max-h-[150px]"
                  url={file.url}
                  showInitialPlayButton={false}
                />
              )}
            </div>
          </div>
        </Link>
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex h-fit items-center">
            <Badge className="text-[8px] md:text-xs">
              {typeOfFile(file.fileType)}
            </Badge>
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
  );
  if (isAlbum && flattedAlbumFiles?.length === 0) {
    return <EmptyPage isInsideAlbum={true} />;
  }
  if (files?.length === 0) {
    return (
      <EmptyPage
        gallerySlug={gallerySlug}
        isAlbumOrFilePage={isAlbumOrFileEnum.file}
      />
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-center text-3xl font-bold">
        {isAlbum ? albumFilesData?.name : "Your Gallery"}
      </h1>
      <div className="flex items-center gap-2">
        {selectedFiles.length > 0 ? (
          <div className="flex items-center gap-2 xl:hidden">
            <DeleteButton fileType={fileType} />
            <ToAlbumButton gallerySlug={gallerySlug ?? ""} />
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
        {isLoading || isAlbumFilesLoading
          ? Array.from({ length: windowSize(5, 10) }).map((_, idx) => (
            <div className="flex flex-col gap-1" key={idx}>
              <Skeleton className="h-[80px] w-[80px] rounded-md md:h-[150px] md:w-[150px]" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-[40px] rounded-xl" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          ))
          : filteredFiles?.map((file, idx) => renderFile(file, idx))}
      </div>
    </div>
  );
};

export default Files;
