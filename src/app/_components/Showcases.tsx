"use client";
import dayjs from "dayjs";
import { api } from "~/trpc/react";
import relativeTime from "dayjs/plugin/relativeTime";
import type { User } from "~/types/types";
import Showcase from "./Showcase";
import { Separator } from "~/components/ui/separator";
import BlurFade from "~/components/ui/blur-fade";
dayjs.extend(relativeTime);

const Showcases: React.FC<{ currentUser: User | undefined | null }> = ({
  currentUser,
}) => {
  const { data: showcaseFiles } = api.file.getShowcaseFiles.useQuery();
  if (showcaseFiles?.length === 0)
    return (
      <h1 className="absolute top-1/2 -translate-y-1/2 text-center text-2xl">
        No showcases yet. look up from the search bar and follow people to have
        a feed of their work
      </h1>
    );

  return (
    <div className="flex w-full flex-col gap-4 lg:w-3/5">
      {showcaseFiles?.map((file, idx) => (
        <BlurFade
          className="flex flex-col gap-4"
          key={file.id}
          delay={0.25 + Number(idx) * 0.05}
          inView
        >
          <Showcase file={file} currentUser={currentUser} isFullView={false} />
          {/* {idx < showcaseFiles.length - 1 && <Separator />} */}
        </BlurFade>
      ))}
    </div>
  );
};

export default Showcases;
