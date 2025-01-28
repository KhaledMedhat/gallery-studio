"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useFileStore } from "~/store";
import UpdateFileView from "./UpdateFileView";
import { api } from "~/trpc/react";
import { type User } from "~/types/types";
import Showcase from "./Showcase";
import { Modal } from "./Modal";

dayjs.extend(relativeTime);
const FileModalView: React.FC<{
  fileId: string;
  user: User | undefined | null;
}> = ({ fileId, user }) => {
  const { isUpdating } = useFileStore();
  const { data: file, isPending } = api.file.getFileById.useQuery({
    id: fileId,
  });

  return (
    <Modal isPending={isPending}>
      {!isUpdating && file ? (
        <div className="w-full flex items-center justify-center">
          <Showcase file={file} currentUser={user} isFullView={true} />
        </div>
      ) : (
        file && (
          <UpdateFileView
            file={file}
            username={file.user.name}
            imageWanted={true}
          />
        )
      )}
    </Modal>
  );
};

export default FileModalView;
