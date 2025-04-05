import SearchBar from "~/app/_components/SearchBar";
import TagsShowcases from "~/app/_components/TagsShowcases";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const q = searchParams.q;

  return (
    <main className="container relative mx-auto my-8 flex flex-col items-center gap-10 px-4 py-10">
      <SearchBar />
      <TagsShowcases tagName={q} />
    </main>
  );
}
