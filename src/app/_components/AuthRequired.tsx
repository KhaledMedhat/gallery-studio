"use client";
import { useRouter } from "next/navigation";
import BlurFade from "~/components/ui/blur-fade";
import type { User } from "~/types/types";
import Navbar from "./Navbar";
import { ArrowLeft, LockIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

const AuthRequired: React.FC<{ currentUser: User | null | undefined }> = ({
  currentUser,
}) => {
  const router = useRouter();
  return (
    <BlurFade delay={0.6} inView className="flex h-screen flex-col items-center justify-center gap-80 md:gap-96">
      <Navbar currentUser={currentUser} />
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <LockIcon size={40} color="red" />
          </div>
          <h1 className="text-center text-2xl font-bold">Login Required</h1>
          <p className="w-3/4 text-center md:w-full">
            You need to be logged in to access this page.
          </p>
          <p className="w-3/4 text-center md:w-full">
            Please log in to your account to view this content. If you
            don&apos;t have an account, you may need to sign up first.
          </p>
          <div className="flex w-full flex-col items-center gap-4 space-y-2">
            <Button className="w-1/2" onClick={() => router.push("/sign-in")}>
              Go to Login
            </Button>
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20} /> Go Back
            </Button>
          </div>
        </div>
      </div>
    </BlurFade>
  );
};

export default AuthRequired;
