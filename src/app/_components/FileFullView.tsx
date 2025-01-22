"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import type { User } from "~/types/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Showcase from "./Showcase";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

dayjs.extend(relativeTime);

const FileFullView: React.FC<{
  user: User | undefined | null;
  imageId: string;
  gallerySlug?: string;
}> = ({ user, imageId, gallerySlug }) => {
  const router = useRouter();
  const { data: file, isPending } = api.file.getFileById.useQuery({
    id: imageId,
  });
  return (
    <section className="container mx-auto flex flex-col items-start justify-around gap-4 p-4">
      <Button variant="link" className="p-0" onClick={() => router.back()}>
        <ChevronLeft size={20} />
        {gallerySlug ? "Back to Gallery" : "Back"}
      </Button>
      {isPending ? (
        <div className="flex w-full flex-col items-center gap-2 pt-2">
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
            <Skeleton className="aspect-w-2 aspect-h-1 h-[400px] w-full rounded-lg" />
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
      ) : (
        <Showcase file={file} currentUser={user} isFullView={true} />
      )}
    </section>
  );
};

export default FileFullView;
