import Images from "~/app/_components/Images";

export default async function UserGalleryPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {

  return <Images gallerySlug={gallerySlug} />;
}
