export default async function ImagePage({
    params: { id: imageId },
  }: {
    params: { id: string };
  }) {
    return (
      <div>
          <h1>
              {imageId}
          </h1>
      </div>
    );
  }
  