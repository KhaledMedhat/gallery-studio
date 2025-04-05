"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LockIcon, ArrowLeft, Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import BlurFade from "~/components/ui/blur-fade";
import Navbar from "./Navbar";
import type { User } from "~/types/types";

const PrivateGalleryAccessDenied: React.FC<{
  currentUser: User | null | undefined;
}> = ({ currentUser }) => {
  const router = useRouter();
  return (
    <BlurFade delay={0.6} inView className="flex h-screen flex-col items-center justify-center  gap-80 md:gap-96">
      <Navbar currentUser={currentUser} />
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <LockIcon color="purple" size={40} />
          </div>
          <h1 className="text-center text-2xl font-bold">
            Oops! Private Gallery
          </h1>
          <p className="w-3/4 text-center md:w-full">
            Nah nah, you can&apos;t peek in here!
          </p>
          <p className="w-3/4 text-center md:w-full">
            This gallery is private and belongs to another user. Each
            user&apos;s gallery is their own personal space to do whatever they
            want with it.
          </p>
          <p className="w-3/4 text-center md:w-full">
            You can&apos;t change the URL to access other people&apos;s
            galleries. How about checking out your own awesome gallery instead?
          </p>
          <div className="flex w-full flex-col items-center gap-4 space-y-2">
            <Button
              className="w-1/2"
              onClick={() =>
                router.push(`/galleries/${currentUser?.gallery?.slug}`)
              }
            >
              <Home className="mr-2 h-4 w-4" /> Go to My Gallery
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

export default PrivateGalleryAccessDenied;
