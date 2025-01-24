import { signIn, SessionProvider } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Image from "next/legacy/image";

const AuthButtons = () => {
  return (
    <SessionProvider>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          className="flex w-full transform items-center gap-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={async () =>
            void (await signIn("google", { callbackUrl: "/showcases" }))
          }
        >
          <Image src={"/google.svg"} alt="google_icon" width={25} height={25} />
          Google
        </Button>
        <Button
          className="flex w-full transform items-center gap-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={async () =>
            void (await signIn("twitter", { callbackUrl: "/showcases" }))
          }
        >
          <Image
            src={"/twitter.svg"}
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
