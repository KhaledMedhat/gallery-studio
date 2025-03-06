import React from "react";

export default function GalleryPageLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      {children}
      {modal}
    </main>
  );
}
