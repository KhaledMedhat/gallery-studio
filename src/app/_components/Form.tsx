"use client";
import SignUp from "./SignUp";
import { usePathname } from "next/navigation";
import SignIn from "./SignIn";
import Link from "next/link";
import Image from "next/image";

const From = () => {
  const pathname = usePathname();
  if (pathname === "/sign-in") {
    return (
      <section className="flex min-h-screen w-screen flex-col items-center justify-center gap-6 px-6 py-10">
        <Link href={"/"}>
          <Image
            src="/logo-white.svg"
            alt="logo"
            width={200}
            height={100}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
        <SignIn />
      </section>
    );
  }
  if (pathname === "/sign-up") {
    return (
      <section className="flex min-h-screen w-screen flex-col items-center justify-center gap-6 px-6 py-10">
        <Link href={"/"}>
          <Image
            src="/logo-white.svg"
            alt="logo"
            width={200}
            height={100}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
        <SignUp />
      </section>
    );
  }
};

export default From;
