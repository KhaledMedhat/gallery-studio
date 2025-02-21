import { getServerSession } from "next-auth";
import React from "react";
import GalleryNavbar from "~/app/_components/GalleryNavbar";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function GalleryPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const currentUser = await getServerSession(authOptions)
  const files = await api.file.getFiles();
  return (
    <>
      <GalleryNavbar user={currentUser?.user} files={files} />
      {children}
    </>
  );
}
