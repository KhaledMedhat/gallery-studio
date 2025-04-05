import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { featuredArtworks, NoiseBackground } from "~/constants/consts";
import dayjs from "dayjs";
import { HeroParallax } from "~/components/ui/hero-parallax";
import { FeaturesSection } from "~/components/ui/feature-section";
import { ArrowRight } from "lucide-react";
import Logo from "../_components/Logo";

export default async function Home() {
  return (
    <HydrateClient>
      <section className="relative flex flex-col gap-40">
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
            <div className=" z-10 rounded-xl p-10 w-full" style={{ backgroundImage: `url(${NoiseBackground})` }}>
              <div className="flex flex-col items-center gap-4 w-full">
                <h2 className="text-center text-balance mx-auto text-3xl md:text-5xl font-semibold tracking-[-0.015em] text-white">
                  Ready to create your Gallery? <br /> Sign up now!
                </h2>
                <p className="mt-4 max-w-[26rem] text-center mx-auto  text-base/6 text-neutral-200">
                  GalleryStudio has just launched! Come take your showcases into your Gallery and Albums by joining now.
                </p>
                <div className="flex items-center gap-4 mt-10">
                  <Button variant="default"><Link href='/sign-up'>Get started</Link></Button>
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
      </section>
    </HydrateClient >
  );
}
