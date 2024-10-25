import React from "react";
import GalleryNavbar from "~/app/_components/GalleryNavbar";

export default function GalleryPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { id: string };
}>) {
  return (
    <div>
      <GalleryNavbar gallerySlug={params.id} />
      {children}
    </div>
  );
}
