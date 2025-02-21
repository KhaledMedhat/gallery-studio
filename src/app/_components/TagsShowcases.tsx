"use client";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { api } from "~/trpc/react";
import Video from "./Video";
import { Skeleton } from "~/components/ui/skeleton";

const TagsShowcases: React.FC<{ tagName: string | undefined }> = ({
  tagName,
}) => {
  const { data: tagShowcases, isLoading } = api.file.getShowcasesByTag.useQuery(
    {
      tagName: tagName ?? "",
    },
  );
  return (
    <section className="flex flex-col items-center gap-6">
      {tagName && <h1 className="text-2xl font-bold">#{tagName}</h1>}
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[300px] w-[300px] rounded-md" />
          ))
          : tagShowcases?.map((showcase) => (
            <div key={showcase.id} className="relative h-[300px] w-[300px]">
              <Link href={`/showcases/${showcase?.id}`}>
                {showcase?.fileType?.includes("video") ? (
                  <Video
                    url={showcase.url}
                    className="rounded-lg xl:h-[752px]"
                  />
                ) : (
                  <div className="aspect-w-2 aspect-h-1 h-auto w-full">
                    <AspectRatio
                      ratio={1 / 1}
                      className="rounded-lg bg-muted"
                    >
                      <Image
                        priority
                        src={showcase?.url ?? ""}
                        alt={`One of ${showcase?.user?.name}'s images`}
                        layout="fill"
                        className="h-full w-full rounded-md object-contain"
                      />
                    </AspectRatio>
                  </div>
                )}
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
};

export default TagsShowcases;
