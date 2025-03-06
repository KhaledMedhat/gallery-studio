import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import DockNavbar from "../_components/DockNavbar";

export default async function InnerAppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const currentUser = await getServerSession(authOptions)
    return (
        <main className="flex min-h-screen w-full flex-col">
            <DockNavbar user={currentUser?.user} />
            {children}
        </main>
    );
}
