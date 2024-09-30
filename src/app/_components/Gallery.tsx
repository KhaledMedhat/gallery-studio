const Gallery: React.FC<{ gallerySlug: string }> = ({ gallerySlug }) => {
  return (
    <div>
      <h1>this is the gallery</h1>
      {gallerySlug}
    </div>
  );
};

export default Gallery;
