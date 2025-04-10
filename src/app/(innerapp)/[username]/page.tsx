import { api } from "~/trpc/server";
import BlurFade from "~/components/ui/blur-fade";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { AlertCircle, Home, Telescope } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import Navbar from "~/app/_components/Navbar";
import UserProfile from "~/app/_components/UserProfile";

export default async function UserPage({
    params: { username: username },
}: {
    params: { username: string };
}) {
    const headersList = headers()
    const url = headersList.get('referer')
    const currentUser = await getServerSession(authOptions)
    try {
        const user = await api.user.getUserByUsername({ username });
        const files = await api.file.getUserFiles({ id: user.id })
        return (
            <UserProfile user={user} currentUser={currentUser?.user} files={files} />
        );
    } catch (error) {
        if (error instanceof TRPCError && error.code === "NOT_FOUND") {
            return (
                <BlurFade delay={0.6} inView className="flex flex-col gap-40 md:gap-96">
                    <Navbar currentUser={currentUser?.user} />
                    <div className='flex items-center justify-center'>
                        <div className='flex flex-col items-center gap-6'>
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-4">
                                <AlertCircle size={40} color="brown" />
                            </div>
                            <h1 className="text-2xl font-bold text-center">404 - Not Found</h1>
                            <p className="text-center">
                                Oops! {url} the user you&apos;re looking for doesn&apos;t exist.
                            </p>
                            <p className="text-center">
                                It seems you&apos;ve went to wrong place. Don&apos;t worry, we&apos;ll help you find your way back.
                            </p>
                            <div className="flex flex-col items-center justify-center space-y-2 w-full">
                                <Button asChild className="w-1/2">
                                    <Link href={'/'} className="flex items-center gap-2">
                                        <Home size={20} /> Go to Homepage
                                    </Link>
                                </Button>
                                <Button asChild className="w-1/2" variant='outline'>
                                    <Link href={'/showcases'} className="flex items-center gap-2">
                                        <Telescope size={20} /> Explore
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </BlurFade>
            )
        }
        if (error instanceof TRPCError && error.code === 'UNAUTHORIZED') {
            redirect('/auth-require')
        }
    }
}