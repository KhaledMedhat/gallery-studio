export default async function ImagePage({
  params: { imageId: imageId },
}: {
  params: { imageId: string };
}) {
  return (
    <div>
      <h1>{imageId}</h1>
    </div>
  );
}
