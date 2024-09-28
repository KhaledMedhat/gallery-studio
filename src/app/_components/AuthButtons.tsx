import { signIn, SessionProvider } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useToast } from "~/hooks/use-toast";
import { useEffect, useState } from "react";

const AuthButtons = () => {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const searchParams = new URLSearchParams(window.location.search);
      const error = searchParams.get('error');
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign-in Error",
          description: error,
        });
      }
      
    }
  }, [isMounted, toast]);
  const handleProviderSignIn = async (provider: string) => {
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Sign-in Error",
          description: result.error,
        });
      } else if (result?.ok) {
        toast({
          variant: "default",
          title: "Sign-in Successful",
          description: `You've successfully signed in with ${provider}.`,
        });
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Sign-in Error",
        description: "An unexpected error occurred during sign-in.",
      });
    }
  };
  return (
    <SessionProvider>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          className="flex w-full transform items-center gap-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={async () => void (await handleProviderSignIn("google"))}
        >
          <Image
            src={"./google.svg"}
            alt="google_icon"
            width={25}
            height={25}
          />
          Google
        </Button>
        <Button
          className="flex w-full transform items-center gap-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={async () => void (await signIn("twitter"))}
        >
          <Image
            src={"./twitter.svg"}
            alt="twitter_icon"
            width={25}
            height={25}
          />
          X
        </Button>
      </div>
    </SessionProvider>
  );
};

export default AuthButtons;
