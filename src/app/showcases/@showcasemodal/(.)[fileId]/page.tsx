import { getServerSession } from "next-auth";
import FileModalView from "~/app/_components/FileModalView";
import { authOptions } from "~/server/auth";

export default async function ShowCasesFilePage({
  params: { fileId: fileId },
}: {
  params: { fileId: string };
}) {
  const currentUser = await getServerSession(authOptions)

  return <FileModalView fileId={fileId} user={currentUser?.user} />;
}
