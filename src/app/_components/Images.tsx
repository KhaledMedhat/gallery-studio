"use client";
import Image from "next/image";
import { api } from "~/trpc/react";
interface ImagesType {
  id: string;
  url: string;
  caption: string | null;
  createdAt: Date;
  galleryId: number;
  createdById: string;
  tags: string[] | null;
  imageKey: string | null;
  albumId: number | null;
}
const Images: React.FC<{ gallerySlug: string }> = ({
  gallerySlug,
}) => {
  const {data: images} = api.image.getImage.useQuery();
  return (
    <div className="grid px-20 py-10 grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      {images?.length === 0 ? (
        <div>No images found</div>
      ) : (
        images?.map((image) => (
          <div
            key={image.id}
            className="relative h-48 w-full aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={image.url}
              alt="image"
              layout="fill"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 hover:scale-110"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Images;
