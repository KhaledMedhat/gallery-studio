import FileModalView from "~/app/_components/FileModalView";
import { Modal } from "~/app/_components/Modal";
import { api } from "~/trpc/server";

export default async function ShowCasesFilePage({
  params: { fileId: fileId },
}: {
  params: { fileId: string };
}) {
  const currentUser = await api.user.getUser();
  return <FileModalView fileId={fileId} user={currentUser} />;
}
