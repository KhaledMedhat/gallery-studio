import Albums from "~/app/_components/Albums";

export default async function GalleryAlbumsPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {

  return <Albums gallerySlug={gallerySlug} />;
}
