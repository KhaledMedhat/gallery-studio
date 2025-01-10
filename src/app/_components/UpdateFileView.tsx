"use client";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import type { fileType } from "~/types/types";
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
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState } from "react";
import { typeOfFile } from "~/utils/utils";

const UpdateFileView: React.FC<{
  file: fileType;
  username?: string | null | undefined;
  imageWanted: boolean;
}> = ({ file, username, imageWanted }) => {
  const [privacy, setPrivacy] = useState<"public" | "private" | null>(
    file.filePrivacy,
  );
  const { setIsUpdating, setIsUpdatingPending } = useFileStore();
  const utils = api.useUtils();
  const router = useRouter();
  const formSchema = z.object({
    caption: z.string().min(1, { message: "Caption cannot be empty" }),
    tags: z
      .string()
      .optional()
      .refine(
        (tagString) => {
          // Split the string into individual tags based on spaces
          const tags = tagString?.split(" ").filter(Boolean); // Filter out any empty spaces
          // Check each tag starts with #, contains only one #, and is not only #
          return tags?.every(
            (tag) => tag.startsWith("#"), // Starts with #
          );
        },
        {
          message: "Each tag must start with #",
        },
      )
      .refine(
        (tagString) => {
          const tags = tagString?.split(" ").filter(Boolean); // Filter out any empty spaces
          return tags?.every(
            (tag) => tag.indexOf("#") === tag.lastIndexOf("#"), // Contains only one #
          );
        },
        { message: "Tags cannot contain more than one #" },
      )
      .refine(
        (tagString) => {
          const tags = tagString?.split(" ").filter(Boolean); // Filter out any empty spaces
          return tags?.every(
            (tag) => tag.trim().length > 1, // Not just "#"
          );
        },
        { message: "Invalid tag" },
      ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: file.caption!,
      tags: file.tags?.toString().split(",").join(" ") ?? "",
    },
  });

  const { mutate: updateFile, isPending: isFileUpdating } =
    api.file.updateFile.useMutation({
      onMutate: () => {
        setIsUpdatingPending(isFileUpdating);
      },
      onSuccess: () => {
        setIsUpdating(false);
        toast({
          title: "Updated Successfully.",
          description: `Images has been Updated successfully.`,
        });
        void utils.file.getFileById.invalidate({ id: file.id });
        void utils.file.getFiles.invalidate();
        if (!imageWanted) router.refresh();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Updating Image Failed.",
          description: `Uh oh! Something went wrong. Please try again.`,
        });
      },
      onSettled: () => {
        setIsUpdatingPending(false);
      },
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const initialTags = file.tags?.toString().split(",").join(" ");
    const isChanged =
      data.caption !== (file.caption ?? "") || data.tags !== initialTags;
    if (!isChanged && !privacy) {
      setIsUpdating(false);
      toast({
        description: `No changes made.`,
      });
    } else {
      const tags = data.tags
        ?.split(" ") // convert string to array as api expects
        .filter((tag) => tag.startsWith("#") && tag.trim() !== "");

      if (privacy) {
        updateFile({
          id: file.id,
          caption: data.caption,
          tags,
          privacy,
        });
      }
    }
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
      {imageWanted && (
        <div className="relative mx-auto flex w-full max-w-full flex-col gap-4">
          {typeOfFile(file.fileType) === "Video" ? (
            <Video url={file.url} className="rounded-lg" />
          ) : (
            <div className="aspect-w-16 aspect-h-9 relative h-auto w-full">
              <AspectRatio ratio={4 / 3} className="bg-muted">
                <Image
                  src={file.url}
                  alt={`One of ${username}'s images`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
            </div>
          )}
        </div>
      )}
      {privacy && (
        <Select
          value={privacy}
          onValueChange={(value) => setPrivacy(value as "public" | "private")}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={file.filePrivacy} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </section>
  );
};

export default UpdateFileView;
