"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { isAlbumOrFileEnum } from "~/types/types";
import BlurFade from "~/components/ui/blur-fade";
import AddFileButton from "./AddFileButton";
import ChooseFilesModal from "./ChooseFilesModal";

const EmptyPage: React.FC<{
  gallerySlug?: string;
  isAlbumOrFilePage?: isAlbumOrFileEnum;
  isInsideAlbum?: boolean;
}> = ({ gallerySlug, isAlbumOrFilePage, isInsideAlbum }) => {

  const utils = api.useUtils();
  const formSchema = z.object({
    albumTitle: z.string().min(1, { message: "Album name Cannot be empty." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      albumTitle: "",
    },
  });
  const { mutate: addAlbum, isPending: isAddFilePending } =
    api.album.createAlbum.useMutation({
      onSuccess: () => {
        form.reset();
        toast({
          title: "Created Successfully.",
          description: `Album has been created successfully.`,
        });
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

  const justText =
    isInsideAlbum ? <h1 className="w-3/5 text-center text-2xl leading-relaxed tracking-wide">
      No Images or Videos in your album, hurry up and add some and save your
      moments, click the button below
    </h1> : isAlbumOrFilePage === isAlbumOrFileEnum.album ? (
      <h1 className="w-1/2 text-center text-2xl leading-relaxed tracking-wide">
        No Albums, add one to get started and save your lovely moments in it,
        click the button below
      </h1>
    ) : (
      <h1 className="w-3/5 text-center text-2xl leading-relaxed tracking-wide">
        No Images or Videos in your gallery, hurry up and add some and save your
        moments, click the button below
      </h1>
    );


  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (gallerySlug) {
      addAlbum({
        title: data.albumTitle,
        id: gallerySlug,
      });
    }
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {isInsideAlbum ?
        <BlurFade delay={0.6} inView>
          <div className="flex flex-col items-center gap-4">
            {justText}
            <ChooseFilesModal isInsideAlbum={isInsideAlbum} />
          </div>
        </BlurFade>

        : isAlbumOrFilePage === isAlbumOrFileEnum.album ? (
          <BlurFade delay={0.6} inView>
            <div className="flex flex-col items-center gap-4">
              {justText}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Add Album</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Album</DialogTitle>
                    <DialogDescription>
                      Make your albums stand out with a Title , Images and Videos.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      id="album-id"
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="albumTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="example" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter your album title.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  <DialogFooter>
                    <Button form="album-id" type="submit">
                      {isAddFilePending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </BlurFade>
        ) : (
          <BlurFade delay={0.6} inView>
            <div className="flex flex-col items-center gap-4">
              {justText}
              {gallerySlug && <AddFileButton gallerySlug={gallerySlug} isEmptyPage={true} />}
            </div>
          </BlurFade>
        )}
    </div>
  );
};

export default EmptyPage;
