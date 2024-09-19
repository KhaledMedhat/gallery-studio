"use client";

import type { Session } from "next-auth";
import { signIn, signOut, SessionProvider } from "next-auth/react";
import Link from "next/link";

const AuthButton: React.FC<{ session: Session | null }> = ({ session }) => {
  console.log(session);
  return (
    <>
    <Link href={"/sign-in"}>Sign In</Link>
    <SessionProvider>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
        {!session && <Link className="bg-white text-black p-6 rounded-xl" href="/sign-up">Register</Link>}
        <button
          onClick={async() => (session ? void signOut() : void await signIn("google"))}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </button>
      </div>
    </SessionProvider>
    </>
  );
};

export default AuthButton;
