import FileModalView from "~/app/_components/FileModalView";
import { Modal } from "~/app/_components/Modal";
import { api } from "~/trpc/server";

export default async function ImagePage({
  params: { imageId: imageId },
}: {
  params: { imageId: string };
}) {
  const user = await api.user.getFileUser({ id: imageId });
  return (
    <Modal
      fileId={imageId}
      name={user?.name}
      profileImage={user?.image}
      bio={user?.bio}
      createdAt={user?.createdAt}
    >
      <FileModalView fileId={imageId} userName={user?.name} />
    </Modal>
  );
}
