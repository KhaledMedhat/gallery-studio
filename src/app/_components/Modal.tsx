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

dayjs.extend(relativeTime);
export function Modal({
  children,
  name,
  bio,
  profileImage,
  createdAt,
  fileId,
}: {
  children: React.ReactNode;
  name?: string | null;
  bio?: string | null;
  profileImage?: string | null;
  createdAt?: Date | null;
  fileId: string;
}) {
  const router = useRouter();
  const { data: file } = api.file.getFileById.useQuery({ id: fileId });
  const handleOpenModalChange = () => {
    router.back();
  };
  const initials = getInitials(name ?? "");
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenModalChange}>
      <DialogOverlay>
        <DialogContent isClosed={true}>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={profileImage ?? ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0 font-bold">
                    @{name}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex items-center justify-start space-x-4">
                    <Avatar>
                      <AvatarImage src={profileImage ?? ""} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@{name}</h4>
                      <p className="text-sm">{bio ? `${bio}.` : ""}</p>
                      <div className="flex items-center pt-2">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          Joined {dayjs(createdAt).format("MMMM")}{" "}
                          {dayjs(createdAt).format("YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {file && (
              <FileOptions
                fileId={fileId}
                fileKey={file.fileKey}
                handleOpenModalChange={handleOpenModalChange}
              />
            )}
          </DialogTitle>
          {children}
          <DialogDescription></DialogDescription>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}

// make view count in the dialog description in the image when u finish user profile to other users.
// make likes count in the dialog description in the image when u finish user profile to other users with a button that has icon love.
