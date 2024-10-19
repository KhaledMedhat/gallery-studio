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
import { ToastAction } from "~/components/ui/toast";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const EmptyAlbumPage: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
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
  const { mutate: addAlbum, isPending } = api.album.createAlbum.useMutation({
    onSuccess: () => {
      form.reset();
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
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addAlbum({
      title: data.albumTitle,
      id: gallerySlug,
    });
  };
  return (
    <div>
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
                    <FormDescription>Enter your album title.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button form="album-id" type="submit">
              {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmptyAlbumPage;
