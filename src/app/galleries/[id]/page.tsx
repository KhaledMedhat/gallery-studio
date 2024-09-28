import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function UserGalleryPage({
  params: { id: galleryId },
}: {
  params: { id: string };
}) {
  return (
    <div>
      <Button variant="link" className="flex items-center gap-2">
        <ArrowLeftIcon className="h-4 w-4" />
        <Link href="/">Back</Link>
      </Button>

      <h1>{galleryId}</h1>
    </div>
  );
}
