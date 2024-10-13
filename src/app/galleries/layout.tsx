import React from "react";

export default function GalleryPageLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main>
        {children}
        {modal}
      </main>
    </div>
  );
}
