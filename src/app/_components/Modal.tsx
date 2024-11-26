"use client";

import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { getInitials } from "~/utils/utils";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import FileOptions from "./FileOptions";
import { api } from "~/trpc/react";
import { useFileStore } from "~/store";
import { type User } from "~/types/types";

dayjs.extend(relativeTime);
export function Modal({
  children,
  fileId,
  user,
}: {
  children: React.ReactNode;
  fileId: string;
  user: User | undefined | null;
}) {
  const router = useRouter();
  const { data: file } = api.file.getFileById.useQuery({ id: fileId });
  const { setIsCommenting } = useFileStore();
  const handleOpenModalChange = () => {
    setIsCommenting(false)
    router.back();
  };
  const initials = getInitials(file?.user.firstName ?? "", file?.user.lastName ?? "");
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenModalChange}>
      <DialogOverlay >
        <DialogContent className="h-[80vh] overflow-y-auto">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={file?.user.image ?? ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0 font-bold" tabIndex={-1}>
                    @{file?.user.name}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex items-center justify-start space-x-4">
                    <Avatar>
                      <AvatarImage src={file?.user.image ?? ""} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@{file?.user.name}</h4>
                      <p className="text-sm">{file?.user.bio ? `${file?.user.bio}.` : ""}</p>
                      <div className="flex items-center pt-2">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          Joined {dayjs(file?.user.createdAt).format("MMMM")}{" "}
                          {dayjs(file?.user.createdAt).format("YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {file && user?.id === file.user.id && (
              <FileOptions
                fileType={file.fileType}
                fileId={fileId}
                fileKey={file.fileKey}
                handleOpenModalChange={handleOpenModalChange}
              />
            )}
          </DialogTitle>
          {children}
          <DialogDescription>
          </DialogDescription>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
