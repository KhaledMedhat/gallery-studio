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
  console.log(params.id)
  return (
    <div>
      <GalleryNavbar gallerySlug={params.id} />
      <section>
        {children}
      </section>
    </div>
  );
}
