import Albums from "~/app/_components/Albums";

export default async function GalleryAlbumsPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mt-8 font-bold text-center">Your Albums</h1>
      <Albums gallerySlug={gallerySlug} />
    </div>
  )
}
