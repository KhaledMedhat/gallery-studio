"use client";
import dayjs from "dayjs";
import { api } from "~/trpc/react";
import relativeTime from "dayjs/plugin/relativeTime";
import type { User } from "~/types/types";
import Showcase from "./Showcase";
import BlurFade from "~/components/ui/blur-fade";
import { Skeleton } from "~/components/ui/skeleton";
dayjs.extend(relativeTime);

const Showcases: React.FC<{ currentUser: User | undefined | null }> = ({
  currentUser,
}) => {
  const { data: showcaseFiles, isPending } =
    api.file.getShowcaseFiles.useQuery();
  if (showcaseFiles?.length === 0)
    return (
      <h1 className="absolute top-1/2 -translate-y-1/2 text-center text-2xl">
        No showcases yet. look up from the search bar and follow people to have
        a feed of their work
      </h1>
    );
  return (
    <div className="flex w-full flex-col gap-4 lg:w-3/5">
      {isPending
        ? Array.from({ length: 2 }).map((_, idx) => (
            <div
              className="flex w-full flex-col items-center gap-2 pt-2"
              key={idx}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>

              <div className="flex w-full flex-col gap-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="aspect-w-2 aspect-h-1 h-[400px] w-full rounded-lg md:h-[800px]" />
              </div>

              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>

              <Skeleton className="h-20 w-full" />
            </div>
          ))
        : showcaseFiles?.map((file, idx) => (
            <BlurFade
              className="flex flex-col gap-4"
              key={file.id}
              delay={0.25 + Number(idx) * 0.05}
              inView
            >
              <Showcase
                file={file}
                currentUser={currentUser}
                isFullView={false}
                isWideAspectRatio={false}
              />
            </BlurFade>
          ))}
    </div>
  );
};

export default Showcases;
