import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Files from "~/app/_components/Files";
import { authOptions } from "~/server/auth";

export default async function UserGalleryPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {
  const currentUser = await getServerSession(authOptions)

  if (currentUser?.user.gallery?.slug !== gallerySlug) {
    redirect("/access-denied");
  }

  return <Files gallerySlug={gallerySlug} isAlbum={false} />;
}
