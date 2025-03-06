import { getServerSession } from "next-auth";
import FileModalView from "~/app/_components/FileModalView";
import { authOptions } from "~/server/auth";

export default async function ImagePage({
  params: { imageId: imageId },
}: {
  params: { imageId: string };
}) {
  const currentUser = await getServerSession(authOptions)

  return <FileModalView fileId={imageId} user={currentUser?.user} />;
}
