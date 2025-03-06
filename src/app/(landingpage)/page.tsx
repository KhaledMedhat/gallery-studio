import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { featuredArtworks } from "~/constants/consts";
import Navbar from "../_components/Navbar";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { HeroParallax } from "~/components/ui/hero-parallax";
import { FeaturesSection } from "~/components/ui/feature-section";
import { ArrowRight } from "lucide-react";
import Logo from "../_components/Logo";

export default async function Home() {
  const currentUser = await getServerSession(authOptions)
  // const content = [
  //   {
  //     title: "Real-time Notifications",
  //     description:
  //       "Stay updated with real-time notifications for all activities on the platform. Whether someone follows you, likes your post, comments, replies, mentions you, or adds a showcase, you'll be notified instantly. This ensures that you're always in the loop and never miss out on important interactions. With our notification system, engagement becomes seamless and effortless.",
  //     content: (
  //       <div className="h-full w-full bg-[linear-gradient(to_bottom_right,#06b6d4, #10b981)] flex items-center justify-center p-6 text-background text-lg font-semibold">
  //         Get instant updates on every activity happening in real time.
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Blazing-fast Interface",
  //     description:
  //       "Say goodbye to slow load times and laggy interactions. Our platform is optimized for speed, delivering a seamless experience with every action you take. From navigating through pages to uploading files and engaging with content, everything happens instantly. We prioritize performance to ensure that your workflow remains uninterrupted, allowing you to focus on what truly matters.",
  //     content: (
  //       <div className="h-full w-full bg-[linear-gradient(to_bottom_right, #ec4899, #6366f1)] flex items-center justify-center p-6 text-background text-lg font-semibold">
  //         Enjoy a lightning-fast experience with smooth interactions.
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Private Gallery & Albums",
  //     description:
  //       "Not everyone wants a social media experience, and we understand that. If you prefer to keep your content private, our platform allows you to store and manage your files, galleries, and albums securely. You have complete control over your privacy settings, ensuring that only you can access your saved content. Whether you're using this space for work, personal memories, or creative projects, your data stays safe and just for you.",
  //     content: (
  //       <div className="h-full w-full bg-[linear-gradient(to_bottom_right, #f97316 , #eab308)] flex items-center justify-center p-6 text-background text-lg font-semibold">
  //         Keep your content private and secure, away from the public eye.
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Secure Content & Accounts",
  //     description:
  //       "Security is our top priority. We integrate trusted authentication providers like Google alongside a secure custom login system to ensure that your account and data are always protected. Your information is encrypted, and we follow industry-leading security practices to prevent unauthorized access. You can have peace of mind knowing that your content remains safe from potential threats, giving you full control over your digital space.",
  //     content: (
  //       <div className="h-full w-full bg-[linear-gradient(to_bottom_right, #0f172a, #171717)] flex items-center justify-center p-6 text-background text-lg font-semibold">
  //         Advanced security measures keep your account and data safe.
  //       </div>
  //     ),
  //   },
  // ];

  return (
    <HydrateClient>
      <main className="relative flex flex-col gap-40">
        <Navbar currentUser={currentUser?.user} />
        <HeroParallax products={featuredArtworks} />
        <section>
          <div className="px-8">
            <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-accent-foreground">
              Packed with a lot of features
            </h4>

            <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-muted-foreground text-center font-normal ">
              From posting Images, GIF and even Videos, Having your own Gallery and Albums And more!
              It can make your social media life easier and more fun.
            </p>
          </div>

        </section>
        <FeaturesSection />
        <div className="flex flex-col">
          <div className="h-[50rem] px-10 w-full dark:bg-black bg-white  dark:bg-grid-white/[0.1] bg-grid-black/[0.2] relative flex items-center justify-center">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
            <div className=" z-10 rounded-xl p-10 bg-[url(https://7a68czltvi.ufs.sh/f/E4wvAcFNKybhBnN01TxkOV1NRmqAZL90BT3uKPzQ42vo6I7y)] w-full">
              <div className="flex flex-col items-center gap-4 w-full">
                <h2 className="text-center text-balance mx-auto text-3xl md:text-5xl font-semibold tracking-[-0.015em] text-white">
                  Ready to create your Gallery? <br /> Sign up now!
                </h2>
                <p className="mt-4 max-w-[26rem] text-center mx-auto  text-base/6 text-neutral-200">
                  GalleryStudio has just launched! Come take your showcases into your Gallery and Albums by joining now.
                </p>
                <div className="flex items-center gap-4 mt-10">
                  <Button variant="default">Get started</Button>
                  <Button className="flex items-center" variant='outline'>Join now <ArrowRight size={16} /></Button>
                </div>
              </div>
            </div>

          </div>
          <footer className="flex justify-center  md:justify-around flex-col items-center md:flex-row border-t py-10 md:py-16 md:px-40">
            <div className="flex flex-col w-full  items-center md:items-start gap-2">
              <Button variant='ghost' className="p-0 hover:bg-transparent">
                <Link href={'#top'} className='flex items-center gap-2'>
                  <Logo />
                  GalleryStudio
                </Link>
              </Button>
              <p className="text-muted-foreground">
                &copy;{dayjs().format("YYYY")} GalleryStudio. All rights reserved.
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                Built with <span className="text-red-700 text-3xl">&hearts;</span> by Khaled Medhat.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ul>
                <li><Button variant='link'><Link href="/contact">Contact</Link></Button></li>
                <li><Button variant='link'><Link href="/about">About</Link></Button></li>
                <li><Button variant='link'><Link href="/support">Support</Link></Button></li>
              </ul>
              <ul>
                <li><Button variant='link'><Link href="/support">FAQ</Link></Button></li>
                <li><Button variant='link'><Link href="/support/user-guide">User Guide</Link></Button></li>
                <li><Button variant='link'><Link href="/support/community">Community</Link></Button></li>
              </ul>
            </div>
          </footer>
        </div>
      </main>
    </HydrateClient >
  );
}
