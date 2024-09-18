"use client";

import type { Session } from "next-auth";
import { signIn, signOut, SessionProvider } from "next-auth/react";

const AuthButton: React.FC<{ session: Session | null }> = ({ session }) => {
  console.log(session);
  return (
    <SessionProvider>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
        <button
          onClick={async() => (session ? void signOut() : void await signIn("google"))}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </button>
      </div>
    </SessionProvider>
  );
};

export default AuthButton;
