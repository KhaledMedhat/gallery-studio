import Albums from "~/app/_components/Albums";
import { api } from "~/trpc/server";

export default async function GalleryAlbumsPage() {
  const currentUser = await api.user.getUser()
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mt-8 font-bold text-center">Your Albums</h1>
      <Albums gallerySlug={currentUser?.gallery.slug ?? ""} />
    </div>
  )
}
