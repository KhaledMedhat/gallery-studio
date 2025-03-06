import { getServerSession } from "next-auth";
import Albums from "~/app/_components/Albums";
import { authOptions } from "~/server/auth";

export default async function GalleryAlbumsPage() {
  const currentUser = await getServerSession(authOptions)

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mt-8 font-bold text-center">Your Albums</h1>
      <Albums gallerySlug={currentUser?.user.gallery?.slug ?? ""} />
    </div>
  )
}
