import GalleryNavbar from "~/app/_components/GalleryNavbar";

export default function UserGalleryPageLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: string } }>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <GalleryNavbar gallerySlug={params.id} />
      <main>{children}</main>
    </div>
  );
}
