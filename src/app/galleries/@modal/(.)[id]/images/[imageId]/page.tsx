import ImageModalView from "~/app/_components/ImageModalView";
import { Modal } from "~/app/_components/Modal";
import { api } from "~/trpc/server";

export default async function ImagePage({
  params: { imageId: imageId },
}: {
  params: { imageId: string };
}) {
  const file = await api.file.getFileById({ id: imageId });
  const user = await api.user.getUser();

  return (
    <Modal
      fileId={file.id}
      fileKey={file?.fileKey}
      name={user?.name}
      profileImage={user?.image}
      bio={user?.bio}
      createdAt={user?.createdAt}
    >
      <ImageModalView file={file} userName={user?.name} />
    </Modal>
  );
}
