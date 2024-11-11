import Files from "~/app/_components/Files";

export default async function UserGalleryPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mt-8 font-bold text-center">Your Gallery</h1>
      <Files gallerySlug={gallerySlug} />
    </div>
  )

}
