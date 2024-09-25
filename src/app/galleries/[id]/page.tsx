export default function UserGalleryPage({
  params: { id: galleryId },
}: {
  params: { id: string };
}) {
  return <h1>{galleryId}</h1>;
}
