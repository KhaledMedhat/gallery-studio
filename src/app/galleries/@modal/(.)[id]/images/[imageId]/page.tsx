import ImageModalView from "~/app/_components/ImageModalView";
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
      name={user?.name}
      profileImage={user?.image}
      bio={user?.bio}
      createdAt={user?.createdAt}
    >
      <ImageModalView fileId={imageId} userName={user?.name} />
    </Modal>
  );
}
