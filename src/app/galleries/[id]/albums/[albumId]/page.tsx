import Files from "~/app/_components/Files";

export default async function AlbumPage({
  params: { id: gallerySlug, albumId: albumId },
}: {
  params: { id: string; albumId: string };
}) {
  return <Files isAlbum={true} albumId={albumId} gallerySlug={gallerySlug} />;
}
