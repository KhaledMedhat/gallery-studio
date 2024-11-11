import FileModalView from "~/app/_components/FileModalView";
import { Modal } from "~/app/_components/Modal";

export default async function ShowCasesFilePage({
  params: { fileId: fileId },
}: {
  params: { fileId: string };
}) {
  return (
    <Modal fileId={fileId}>
      <FileModalView fileId={fileId} />
    </Modal>
  )
}

