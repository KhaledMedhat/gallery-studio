"use client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useFileStore } from "~/store";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Skeleton } from "~/components/ui/skeleton";

dayjs.extend(relativeTime);
export function Modal({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending: boolean;
}) {
  const router = useRouter();
  const { setIsCommenting } = useFileStore();
  const handleOpenModalChange = () => {
    setIsCommenting(false);
    router.back();
  };
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenModalChange}>
      <DialogOverlay>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </VisuallyHidden.Root>
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
            children
          )}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
