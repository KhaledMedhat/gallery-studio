"use client";
import { Earth, Images, LoaderCircle, LockKeyhole } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import BlurFade from "~/components/ui/blur-fade";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import Video from "./Video";
import Image from "next/legacy/image";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { toast } from "~/hooks/use-toast";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AddFileButton from "./AddFileButton";
import { typeOfFile } from "~/utils/utils";

const ChooseFilesModal: React.FC<{ isInsideAlbum?: boolean }> = ({
  isInsideAlbum,
}) => {
  const param = useParams();
  const [currentTab, setCurrentTab] = useState<string>("choose-from-gallery");
  const { data: files } = api.file.getFiles.useQuery();
  const { data: albumFiles } = api.file.getAlbumFiles.useQuery({
    id: Number(param.albumId),
  });
  const isTheFileInAlbum = (id: string) => {
    return albumFiles?.some((file) => file.id === id);
  };
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const utils = api.useUtils();
  const { mutate: addToExistedAlbum, isPending } =
    api.album.addToAlbum.useMutation({
      onSuccess: () => {
        toast({
          title: "Added Successfully.",
          description: `Images has been added successfully.`,
        });
        setSelectedFiles([]);
        void utils.file.getAlbumFiles.invalidate();
        void utils.album.getAlbumById.invalidate();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Uh oh! Something went wrong. Please try again.`,
        });
      },
    });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={isInsideAlbum ? "outline" : "ghost"}>
          {isInsideAlbum ? (
            "Add to album"
          ) : (
            <Images
              className={`${albumFiles?.length === 0 && "animate-bounce"}`}
              size={20}
            />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit overflow-y-auto lg:max-w-4xl">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        <Tabs
          onValueChange={setCurrentTab}
          defaultValue="choose-from-gallery"
          className="max-h-[80vh] w-full max-w-full overflow-y-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="choose-from-gallery">
              Choose from gallery
            </TabsTrigger>
            <TabsTrigger value="add-file">Add</TabsTrigger>
          </TabsList>
          <TabsContent value="choose-from-gallery">
            <Card className="max-h-[80vh] w-full">
              <CardHeader>
                <CardTitle>Add from your gallery</CardTitle>
                <CardDescription>
                  You can add images, videos even GIF from your gallery into
                  this album by selecting them.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap justify-center gap-4 p-6">
                {files?.map((file, idx) => (
                  <BlurFade
                    key={file.id}
                    delay={0.25 + Number(idx) * 0.05}
                    inView
                  >
                    <div
                      className={`group relative flex h-full w-full flex-col gap-1 overflow-hidden rounded-lg ${isTheFileInAlbum(file.id) && "hidden"}`}
                    >
                      <Checkbox
                        disabled={isTheFileInAlbum(file.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFiles((prev) => [...prev, file.id]);
                          } else {
                            setSelectedFiles((prev) =>
                              prev.filter((id) => id !== file.id),
                            );
                          }
                        }}
                        className={`absolute right-2 top-2 z-10 items-center justify-center bg-muted`}
                      />
                      <div className="relative h-full w-full">
                        <div className="h-[300px] w-[240px]">
                          {typeOfFile(file.fileType) === "Image" ? (
                            <Image
                              priority
                              src={file.url}
                              alt={`Gallery image ${file.id}`}
                              layout="fill"
                              className={`h-full w-full rounded-md object-cover shadow transition-transform duration-300 hover:scale-105`}
                            />
                          ) : (
                            <Video
                              url={file.url}
                              showInitialPlayButton={false}
                            />
                          )}
                        </div>
                      </div>
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add-file">
            <AddFileButton
              isTabs={true}
              gallerySlug={param.id as string}
              albumId={param.albumId as string}
            />
          </TabsContent>
        </Tabs>
        {currentTab === "choose-from-gallery" && (
          <DialogFooter>
            <Button
              className="w-full"
              disabled={isPending || selectedFiles.length === 0}
              onClick={() =>
                addToExistedAlbum({
                  id: selectedFiles,
                  albumId: Number(param.albumId),
                })
              }
            >
              {isPending ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChooseFilesModal;
