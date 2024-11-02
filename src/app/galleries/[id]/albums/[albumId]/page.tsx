import Album from "~/app/_components/Album";

export default async function AlbumPage({
  params: { albumId: albumId },
}: {
  params: { albumId: string };
}) {
  return (
    <Album id={albumId} />
  );
}
