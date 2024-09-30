import GallerySidebar from "~/app/_components/GallerySidebar";

export default function UserGalleryPageLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: string } }>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <GallerySidebar gallerySlug={params.id} />
      <main>{children}</main>
    </div>
  );
}
