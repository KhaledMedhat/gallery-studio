import Link from "next/link";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { featuredArtworks } from "~/constants/Images";
import Transition from "./_components/Transition";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import ParticlesWrapper from "./_components/ParticlesWrapper";
export default async function Home() {
  const session = await api.user.getUser();
  const userGallery = await api.gallery.getProvidedUserAccountGallery({
    id: session?.id ?? "",
  });
  return (
    <HydrateClient>
      <ParticlesWrapper>
        <Navbar userGallery={userGallery} />
        <Transition>
          <main>
            <section className="py-12 md:py-24">
              <div className="container mx-auto px-4 text-center">
                <div className="flex flex-col gap-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Welcome to GalleryStudio
                  </h1>
                  <p className="mt-4 text-xl text-muted-foreground">
                    Discover a world of captivating artworks Create your
                    personal gallery, Discover a world of captivating artworks,
                    explore other&apos;s collections, and share your favorite
                    moments. Easily upload your own images and discover stunning
                    visuals from a community of creators. Join and showcase your
                    creativity!
                  </p>
                </div>
                <Button className="mt-8" size="lg">
                  Explore Gallery
                </Button>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="mb-8 text-center text-3xl font-bold">
                  Publish Your Artworks
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {featuredArtworks.map((artwork) => (
                    <div
                      key={artwork.id}
                      className="overflow-hidden rounded-lg shadow-md"
                    >
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        width={500}
                        height={350}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button variant="outline">
                    <Link
                      href={
                        userGallery
                          ? `/galleries/${userGallery.slug}`
                          : "/sign-in"
                      }
                    >
                      {session ? "Go to your gallery" : "Join GalleryStudio"}
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </Transition>
      </ParticlesWrapper>
    </HydrateClient>
  );
}
