import FileFullView from "~/app/_components/FileFullView";
import { api } from "~/trpc/server";

export default async function ImagePage({
  params: { imageId: imageId, id: gallerySlug },
}: {
  params: { imageId: string; id: string };
}) {
  const user = await api.user.getFileUser({ id: imageId });
  return (
    <FileFullView user={user} imageId={imageId} gallerySlug={gallerySlug} />
  );
}
