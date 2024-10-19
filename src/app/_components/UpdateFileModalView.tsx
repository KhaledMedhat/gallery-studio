"use client";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { fileType } from "~/types/types";
import Video from "./Video";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import { useFileStore } from "~/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { ToastAction } from "~/components/ui/toast";

const UpdateFileModalView: React.FC<{
  file: fileType;
  userName: string | null | undefined;
}> = ({ file, userName }) => {
  const { setIsUpdating, setIsUpdatingPending } = useFileStore();
  const utils = api.useUtils();

  const formSchema = z.object({
    caption: z.string().optional(),
    tags: z
      .string()
      .transform((str) =>
        str
          .split(" ")
          .map((tag) => tag.trim())
          .filter(Boolean),
      )
      .refine((tags) => tags.every((tag) => tag.startsWith("#")), {
        message: "Each tag must start with #",
      })
      .refine(
        (tags) =>
          tags.every((tag) => tag.indexOf("#") === tag.lastIndexOf("#")),
        {
          message: "Tags cannot contain more than one #",
        },
      )
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: file.caption ?? "",
      tags: [file.tags?.toString().split(",").join(" ")] ?? [],
    },
  });

  const { mutate: updateFile, isPending: isFileUpdating } =
    api.file.updateFile.useMutation({
      onMutate: () => {
        setIsUpdatingPending(isFileUpdating);
      },
      onSuccess: (data) => {
        toast({
          title: "Updated Successfully.",
          description: `Images has been Updated successfully.`,
        });
        if (data[0]?.id)
          void utils.file.getFileById.invalidate({ id: data[0]?.id });
        setIsUpdating(false);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Updating Image Failed.",
          description: `Uh oh! Something went wrong. Please try again.`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
      onSettled: () => {
        setIsUpdating(false);
      },
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateFile({
      id: file.id,
      caption: data.caption,
      tags: data.tags,
    });
  };
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            id="update-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Caption of the image" {...field} />
                    </FormControl>
                    <FormDescription>Update caption.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="#tags" {...field} />
                    </FormControl>
                    <FormDescription>Update tags.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="relative mx-auto flex w-full max-w-full flex-col gap-4">
        {file.fileType?.includes("video") ? (
          <Video url={file.url} className="rounded-lg" />
        ) : (
          <div className="aspect-w-16 aspect-h-9 relative h-auto w-full">
            <AspectRatio ratio={4 / 3} className="bg-muted">
              <Image
                src={file.url}
                alt={`One of ${userName}'s images`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpdateFileModalView;
