import React from "react";
import GalleryNavbar from "~/app/_components/GalleryNavbar";

export default function GalleryPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div>
      <GalleryNavbar />
      {children}
    </div>
  );
}
