"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Home, Info, Mail, LifeBuoy, Telescope } from "lucide-react";
import UserAvatarProfile from "./UserAvatarProfile";
import ModeToggle from "./ModeToggle";
import { type User } from "~/types/types";
import { signIn } from "next-auth/react";
import Logo from "./Logo";

const Navbar: React.FC<{ currentUser: User | null | undefined }> = ({
  currentUser,
}) => {
  const navItems = [
    { title: "Home", link: "/", icon: <Home size={20} />, shouldRender: true },
    { title: "Contact", link: "/contact", icon: <Mail size={20} />, shouldRender: true },
    { title: "About", link: "/about", icon: <Info size={20} />, shouldRender: true },
    { title: "Support", link: "/support", icon: <LifeBuoy size={20} />, shouldRender: true },
    { title: "Showcases", link: "/showcases", icon: <Telescope size={20} />, shouldRender: currentUser },
  ]
  return (

    <header
      className="flex container w-full md:w-3/4 px-8 fixed top-4 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-40 py-2  items-center justify-center space-x-4">
      <div className="w-full flex items-center gap-4">
        <Logo />
        {navItems.map((navItem, idx) => (
          navItem.shouldRender && <Link
            key={`link=${idx}`}
            href={navItem.link}
            className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500">
            <span className="block md:hidden">{navItem.icon}</span>
            <span className="hidden md:block text-sm">{navItem.title}</span>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {currentUser ?
          <UserAvatarProfile user={currentUser} />
          :
          <Button variant="outline" className="m-0 px-4 py-0 rounded-full" onClick={() => signIn()}>
            Login
          </Button>}
        <ModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
