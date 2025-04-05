"use client";
import { useRouter } from "next/navigation";
import BlurFade from "~/components/ui/blur-fade";
import type { User } from "~/types/types";
import Navbar from "./Navbar";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "~/components/ui/button";

const NotFound: React.FC<{
  currentUser: User | null | undefined;
  url: string | null;
}> = ({ currentUser, url }) => {
  const router = useRouter();
  return (
    <BlurFade delay={0.6} inView className="flex h-screen flex-col items-center justify-center  gap-96">
      <Navbar currentUser={currentUser} />
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle size={40} color="brown" />
          </div>
          <h1 className="text-center text-2xl font-bold">404 - Not Found</h1>
          <p className="w-3/4 text-center md:w-full">
            Oops! {url} you&apos;re looking for doesn&apos;t exist.
          </p>
          <p className="w-3/4 text-center md:w-full">
            It seems you&apos;ve went to wrong place. Don&apos;t worry,
            we&apos;ll help you find your way back.
          </p>
          <div className="flex w-full justify-center space-y-2">
            <Button asChild className="w-1/2" onClick={() => router.push("/")}>
              <Home size={20} /> Go to Homepage
            </Button>
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </div>
        </div>
      </div>
    </BlurFade>
  );
};

export default NotFound;
