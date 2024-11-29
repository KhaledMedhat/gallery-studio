import { redirect } from "next/navigation";
import Files from "~/app/_components/Files";
import { api } from "~/trpc/server";

export default async function UserGalleryPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {

  const user = await api.user.getUser()
  if (user?.gallery.slug !== gallerySlug) {
    redirect('/access-denied')
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mt-8 font-bold text-center">Your Gallery</h1>
      <Files gallerySlug={gallerySlug} />
    </div>
  )

}
