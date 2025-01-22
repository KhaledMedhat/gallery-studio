import { TRPCError } from "@trpc/server";
import { AlertCircle, Home, Telescope } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import FileFullView from "~/app/_components/FileFullView";
import Navbar from "~/app/_components/Navbar";
import BlurFade from "~/components/ui/blur-fade";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function ShowCasesFilePage({
  params: { fileId: fileId },
}: {
  params: { fileId: string };
}) {
  const headersList = headers();
  const url = headersList.get("referer");
  const currentUser = await api.user.getUser();

  try {
    return <FileFullView user={currentUser} imageId={fileId} />;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return (
        <BlurFade delay={0.6} inView className="flex flex-col gap-40 md:gap-96">
          <Navbar currentUser={currentUser} />
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <AlertCircle size={40} color="brown" />
              </div>
              <h1 className="text-center text-2xl font-bold">
                404 - Not Found
              </h1>
              <p className="text-center">
                Oops! {url} the showcase you&apos;re looking for doesn&apos;t
                exist.
              </p>
              <p className="text-center">
                It seems you&apos;ve went to wrong place. Don&apos;t worry,
                we&apos;ll help you find your way back.
              </p>
              <div className="flex w-full flex-col items-center justify-center space-y-2">
                <Button asChild className="w-1/2">
                  <Link href={"/"} className="flex items-center gap-2">
                    <Home size={20} /> Go to Homepage
                  </Link>
                </Button>
                <Button asChild className="w-1/2" variant="outline">
                  <Link href={"/showcases"} className="flex items-center gap-2">
                    <Telescope size={20} /> Explore
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </BlurFade>
      );
    }
  }
}
