import { Button } from "~/components/ui/button";
import dayjs from "dayjs";

const Footer = () => {
  return (
    <footer className="py-12 md:py-24">
    <div className="container mx-auto px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold">Join Our Studio Community</h2>
      <p className="mb-8 text-xl text-muted-foreground">
        Get updates on new Galleries, exhibitions, and exclusive events
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-md border border-input px-4 py-2 sm:w-auto"
        />
        <Button className="animate-bounce">Subscribe</Button>
      </div>
        <div className="container mt-12 mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy;{dayjs().format("YYYY")} GalleryStudio. All rights reserved.
          </p>
        </div>
    </div>
  </footer>
  );
};

export default Footer;
