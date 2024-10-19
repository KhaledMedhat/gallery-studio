export default async function ImagePage({
    params: { albumId: albumId },
  }: {
    params: { albumId: string };
  }) {
    return (
      <div>
        <h1>{albumId}</h1>
      </div>
    );
  }
  