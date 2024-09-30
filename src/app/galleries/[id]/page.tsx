import Gallery from "~/app/_components/Gallery";

export default function UserGalleryPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {
  return (
   <Gallery gallerySlug={gallerySlug} />
  );
}
