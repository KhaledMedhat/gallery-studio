
import React from "react";

export default async function ShowcasesPageLayout({
    children,
    showcasemodal,
}: Readonly<{
    children: React.ReactNode;
    showcasemodal: React.ReactNode;

}>) {
    return (
        <main className="flex min-h-screen w-full flex-col">
            {children}
            {showcasemodal}
        </main>
    );
}
