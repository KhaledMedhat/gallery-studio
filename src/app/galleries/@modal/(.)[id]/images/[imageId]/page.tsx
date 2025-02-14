import FileModalView from "~/app/_components/FileModalView";
import { api } from "~/trpc/server";

export default async function ImagePage({
  params: { imageId: imageId },
}: {
  params: { imageId: string };
}) {
  const user = await api.user.getUser();
  return <FileModalView fileId={imageId} user={user} />;
}
