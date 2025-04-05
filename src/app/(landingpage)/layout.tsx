import React from "react";
import Navbar from "../_components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export default async function LandingPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const currentUser = await getServerSession(authOptions)
    return (
        <main className="flex min-h-screen w-full flex-col">
            <Navbar currentUser={currentUser?.user} />
                {children}
        </main>
    );
}
