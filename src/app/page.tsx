import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { featuredArtworks, words } from "~/constants/consts";
import Navbar from "./_components/Navbar";
import { Input } from "~/components/ui/input";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { HeroParallax } from "~/components/ui/hero-parallax";
import { StickyScroll } from "~/components/ui/sticky-scroll-reveal";
import { TypewriterEffectSmooth } from "~/components/ui/typewriter-effect";

export default async function Home() {
  const currentUser = await getServerSession(authOptions)
  const content = [
    {
      title: "Real-time Notifications",
      description:
        "Stay updated with real-time notifications for all activities on the platform. Whether someone follows you, likes your post, comments, replies, mentions you, or adds a showcase, you'll be notified instantly. This ensures that you're always in the loop and never miss out on important interactions. With our notification system, engagement becomes seamless and effortless.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,#06b6d4, #10b981)] flex items-center justify-center p-6 text-background text-lg font-semibold">
          Get instant updates on every activity happening in real time.
        </div>
      ),
    },
    {
      title: "Blazing-fast Interface",
      description:
        "Say goodbye to slow load times and laggy interactions. Our platform is optimized for speed, delivering a seamless experience with every action you take. From navigating through pages to uploading files and engaging with content, everything happens instantly. We prioritize performance to ensure that your workflow remains uninterrupted, allowing you to focus on what truly matters.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right, #ec4899, #6366f1)] flex items-center justify-center p-6 text-background text-lg font-semibold">
          Enjoy a lightning-fast experience with smooth interactions.
        </div>
      ),
    },
    {
      title: "Private Gallery & Albums",
      description:
        "Not everyone wants a social media experience, and we understand that. If you prefer to keep your content private, our platform allows you to store and manage your files, galleries, and albums securely. You have complete control over your privacy settings, ensuring that only you can access your saved content. Whether you're using this space for work, personal memories, or creative projects, your data stays safe and just for you.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right, #f97316 , #eab308)] flex items-center justify-center p-6 text-background text-lg font-semibold">
          Keep your content private and secure, away from the public eye.
        </div>
      ),
    },
    {
      title: "Secure Content & Accounts",
      description:
        "Security is our top priority. We integrate trusted authentication providers like Google alongside a secure custom login system to ensure that your account and data are always protected. Your information is encrypted, and we follow industry-leading security practices to prevent unauthorized access. You can have peace of mind knowing that your content remains safe from potential threats, giving you full control over your digital space.",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right, #0f172a, #171717)] flex items-center justify-center p-6 text-background text-lg font-semibold">
          Advanced security measures keep your account and data safe.
        </div>
      ),
    },
  ];

  return (
    <HydrateClient>
      <main className="min-h-screen max-w-full relative">
        <Navbar currentUser={currentUser?.user} />
        <HeroParallax products={featuredArtworks} />
        <div className="container mx-auto flex flex-col gap-40">
          <article >
            <div className="px-8">
              <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-accent-foreground">
                Packed with a lot of features
              </h4>

              <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-muted-foreground text-center font-normal ">
                From posting Images, GIF and even Videos, Having your own Gallery and Albums And more!
                It can make your social media life easier and more fun.
              </p>
            </div>
            <div className="p-10">
              <StickyScroll content={content} />
            </div>
          </article>

          <section className="flex flex-col items-center justify-center">
            <p className="text-xs sm:text-base  ">
              The road to freedom starts from here
            </p>
            <TypewriterEffectSmooth words={words} />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
              <Button variant='outline'>
                <Link href={'/sign-in'}>Join now</Link>
              </Button>
              <Button variant='default'>
                <Link href={'/sign-up'}>Signup</Link>
              </Button>
            </div>
          </section>

          <footer className=" mb-16 p-10">
            <div className="p-10 text-center bg-accent-foreground  rounded-lg">
              <h2 className="mb-4 text-3xl font-bold text-background">Join Our Studio Community</h2>
              <p className="mb-8 text-xl text-muted-foreground">
                Get updates on new Galleries, exhibitions, and exclusive events
              </p>
              <div className="flex items-center justify-center gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-1/4 bg-transparent text-background"
                />
                <Button variant='outline' className="animate-bounce">Subscribe</Button>
              </div>
              <div className="mt-12 px-4 text-center">
                <p className="text-muted-foreground">
                  &copy;{dayjs().format("YYYY")} GalleryStudio. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </HydrateClient >
  );
}
