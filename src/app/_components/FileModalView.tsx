"use client";
import Image from "next/image";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Earth, LockKeyhole } from "lucide-react";
import { useFileStore } from "~/store";
import UpdateFileModalView from "./UpdateFileModalView";
import { api } from "~/trpc/react";

dayjs.extend(relativeTime);
const FileModalView: React.FC<{
  fileId: string;
  userName: string | null | undefined;
}> = ({ fileId, userName }) => {
  const { isUpdating } = useFileStore();
  const { data: file } = api.file.getFileById.useQuery({ id: fileId });
  return !isUpdating && file ? (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p>{file.caption}</p>
        <div className="flex items-center gap-2">
          {file.tags?.map((tag, idx) => (
            <p key={idx} className="font-bold">
              {tag}
            </p>
          ))}
        </div>
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
                className="h-full w-full rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        )}
        <div className="flex items-center gap-2">
          <p className="text-sm text-accent-foreground">
            {dayjs(file.createdAt).fromNow()}
          </p>
          <span className="block h-1 w-1 rounded-full bg-accent-foreground"></span>
          {file.filePrivacy === 'private' ? <LockKeyhole size={16} className="text-accent-foreground" /> : <Earth size={16} className="text-accent-foreground" />}

        </div>
      </div>
    </section>
  ) : (
    file && <UpdateFileModalView file={file} userName={userName} />
  );
};

export default FileModalView;
