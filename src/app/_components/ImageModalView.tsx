import Image from "next/image";
import type { ImageType } from "~/types/types";
import Video from "./Video";
import { AspectRatio } from "~/components/ui/aspect-ratio";

const ImageModalView: React.FC<{
  file: ImageType;
  userName: string | null | undefined;
}> = ({ file, userName }) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p>{file.caption}</p>
        <p className="font-bold">{file.tags}</p>
      </div>
      <div className="relative mx-auto w-full max-w-full">
        {file.fileType?.includes("video") ? (
          <Video url={file.url} className="rounded-lg" />
        ) : (
          <div className="aspect-w-16 aspect-h-9 relative h-auto w-full">
            <AspectRatio ratio={4/3} className="bg-muted">
              <Image
                src={file.url}
                alt={`One of ${userName}'s images`}
                fill
                className="h-full w-full rounded-md object-cover"
              />
            </AspectRatio>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageModalView;
