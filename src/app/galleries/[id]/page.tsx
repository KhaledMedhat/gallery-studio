import Files from "~/app/_components/Files";

export default async function UserGalleryPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {
  return <Files gallerySlug={gallerySlug} />;
}
