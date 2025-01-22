import { redirect } from "next/navigation";
import Files from "~/app/_components/Files";
import { api } from "~/trpc/server";

export default async function UserGalleryPage({
  params: { id: gallerySlug },
}: {
  params: { id: string };
}) {
  const user = await api.user.getUser();
  if (user?.gallery.slug !== gallerySlug) {
    redirect("/access-denied");
  }

  return <Files gallerySlug={gallerySlug} isAlbum={false} />;
}
