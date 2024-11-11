import React from "react";

export default function ShowcasesPageLayout({
    children,
    showcasemodal,
}: Readonly<{
    children: React.ReactNode;
    showcasemodal: React.ReactNode ;
}>) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <main>
                {children}
                {showcasemodal}
            </main>
        </div>
    );
}
