import { redirect, useSearchParams } from "next/navigation";
import FileModalView from "~/app/_components/FileModalView";
import { Modal } from "~/app/_components/Modal";
import { api } from "~/trpc/server";

export default async function ShowCasesFilePage({
  params: { fileId: fileId },
}: {
  params: { fileId: string };
}) {
  const user = await api.user.getUser();

  return (
    <Modal fileId={fileId} user={user}>
      <FileModalView fileId={fileId} user={user} />
    </Modal>
  )
}

