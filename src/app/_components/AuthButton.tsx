"use client";
import type { Session } from "next-auth";
import { signIn, signOut, SessionProvider } from "next-auth/react";
import Link from "next/link";
import { deleteCookie } from "../actions";
interface User {
  id: string;
  image: string | null;
  email: string;
  name: string | null;
  bio: string | null;
  password: string | null;
  emailVerified: Date | null;
}
const AuthButton: React.FC<{ session: User | null }> = ({ session }) => {
  console.log(session);
  return (
    <>
      {!session ? (
        <Link href={"/sign-in"}>Sign In</Link>
      ) : (
        <form action={deleteCookie}>
          <button type="submit">Sign out</button>
        </form>
      )}

      <SessionProvider>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session ? (
              <span>Logged in as {session.name}</span>
            ) : (
              <span>Not logged in</span>
            )}
          </p>
          {!session && (
            <Link
              className="rounded-xl bg-white p-6 text-black"
              href="/sign-up"
            >
              Register
            </Link>
          )}
          <button
            onClick={async () =>
              session ? void signOut() : void (await signIn("google"))
            }
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
