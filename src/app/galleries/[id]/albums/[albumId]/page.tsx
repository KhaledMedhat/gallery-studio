import Album from "~/app/_components/Album";
import { api } from "~/trpc/server";

export default async function AlbumPage({
  params: { albumId: albumId },
}: {
  params: { albumId: string };
}) {
  const album = await api.album.getAlbumById({ id: Number(albumId) })
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mt-14 font-bold text-center">{album.name} Album</h1>
      <Album id={albumId} />
    </div>

  );
}
