import FileModalView from "~/app/_components/FileModalView";
import { Modal } from "~/app/_components/Modal";
import { api } from "~/trpc/server";

export default async function ImagePage({
  params: { imageId: imageId },
}: {
  params: { imageId: string };
}) {
  const user = await api.user.getUser();
  return (
    <Modal
      fileId={imageId}
      user={user}
    >
      <FileModalView fileId={imageId} user={user} />
    </Modal>
  );
}
