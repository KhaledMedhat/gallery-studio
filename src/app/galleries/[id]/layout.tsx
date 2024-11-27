import React from "react";
import GalleryNavbar from "~/app/_components/GalleryNavbar";
import { api } from "~/trpc/server";

export default async function GalleryPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const user = await api.user.getUser()
  const files = await api.file.getFiles()
  return (
    
    <div>
      <GalleryNavbar user={user} files={files} />
      {children}
    </div>
  );
}
