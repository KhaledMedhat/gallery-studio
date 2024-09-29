import {
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import GallerySidebar from "./GallerySidebar";

const Gallery: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  return (
    <div className="flex min-h-screen w-full">
      <GallerySidebar gallerySlug={gallerySlug} />
        
    </div>
  );
};

export default Gallery;
