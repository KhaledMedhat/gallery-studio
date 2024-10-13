"use client";
import { RefreshCw } from "lucide-react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import BlurFade from "~/components/ui/blur-fade";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const Images: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  // const [imageLoadingErrors, setImageLoadingErrors] = useState<string[]>([]);
  // console.log(imageLoadingErrors);
  // const [selectedImage, setSelectedImage] = useState<any>();
  // console.log(selectedImage);
  // const utils = api.useUtils();
  // const { mutate: getImage, isPending } = api.image.getImageById.useMutation({
  //   onSuccess: (data) => {
  //     setSelectedImage(data);
  //     void utils.image.getImage.invalidate();
  //   },
  // });

  const { data: images, isLoading } = api.image.getImage.useQuery();
  if (images?.length === 0) return <div>No images found</div>;
  return (
    <div className="grid grid-cols-1 gap-6 px-20 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {isLoading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-48 w-full rounded-lg" />
          ))
        : images?.map((image, idx) => (
            <BlurFade key={image.id} delay={0.25 + idx * 0.05} inView>
              <div className="group relative aspect-square h-48 w-full overflow-hidden rounded-lg">
                {/* {imageLoadingErrors.length > 0 ? (
                  selectedImage ? (
                    <Image
                      priority
                      src={selectedImage.url}
                      alt={"image"}
                      layout="fill"
                      style={{ objectFit: "cover" }}
                      className="cursor-pointer transition-transform duration-300 hover:scale-110"
                      // onError={() => {
                      //   setImageLoadingErrors((prev) => ({
                      //     ...prev,
                      //     [selectedImage.id]: true,
                      //   }));
                      // }}
                    />
                  ) : (
                    <Button
                      onClick={() => getImage({ id: image.id })}
                      className="group flex h-full w-full items-center justify-center bg-transparent text-foreground hover:bg-transparent"
                    >
                      <RefreshCw
                        size={32}
                        className={`cursor-pointer transition-transform duration-300 group-hover:scale-110 ${isPending && "animate-spin"}`}
                      />
                    </Button>
                  )
                ) : ( */}
                <Link
                  // href={`/galleries/${gallerySlug}/image-modal/${image.id}`}
                  href={`/galleries/${gallerySlug}/images/${image.id}`}
                >
                  <Image
                    src={image.url}
                    alt={"image"}
                    layout="fill"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="cursor-pointer transition-transform duration-300 hover:scale-110"
                    // onError={() => {
                    //   setImageLoadingErrors([image.id]);
                    // }}
                  />
                </Link>

                {/* )} */}
              </div>
            </BlurFade>
          ))}
    </div>
  );
};

export default Images;
// ...prev,
// [image.id]: true,
