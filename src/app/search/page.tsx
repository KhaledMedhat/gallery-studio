import { api } from "~/trpc/server";
import GalleryNavbar from "../_components/GalleryNavbar";
import SearchBar from "../_components/SearchBar";
import TagsShowcases from "../_components/TagsShowcases";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const q = searchParams.q;
  const currentUser = await api.user.getUser();
  return (
    <main className="container mx-auto my-8 flex flex-col items-center gap-10 px-4 py-10">
      <SearchBar />
      <TagsShowcases tagName={q} />
      <GalleryNavbar user={currentUser} />
    </main>
  );
}
