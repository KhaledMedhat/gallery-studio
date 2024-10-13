import { Modal } from "~/app/_components/Modal";

export default async function ImagePage({
  params: { id: imageId },
}: {
  params: { id: string };
}) {
  return (
    <Modal>
      <div>5555555555 {imageId}</div>
    </Modal>
  );
}
