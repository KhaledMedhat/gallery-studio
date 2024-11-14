import { ArrowLeft, LockIcon } from "lucide-react";
import Link from "next/link";
import BlurFade from "~/components/ui/blur-fade";
import { Button } from "~/components/ui/button";
import Navbar from "../_components/Navbar";

export default async function AuthRequirePage() {
    return (
        <BlurFade delay={0.6} inView>
            <Navbar />
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
                        <LockIcon size={40} color="red" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">Login Required</h1>
                    <p className="text-center">
                        You need to be logged in to access this page.
                    </p>
                    <p className="text-center">
                        Please log in to your account to view this content. If you don&apos;t have an account, you may need to sign up first.
                    </p>
                    <div className="flex flex-col items-center gap-4 space-y-2 w-full">
                        <Button asChild className="w-1/2">
                            <Link href={'/sign-in'}> Go to Login</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-1/2">
                            <Link href={'/'} className="flex items-center gap-2">
                                <ArrowLeft size={20} /> Go Back
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </BlurFade>
    )
}
