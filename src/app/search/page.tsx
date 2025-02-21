import { getServerSession } from "next-auth";
import GalleryNavbar from "../_components/GalleryNavbar";
import SearchBar from "../_components/SearchBar";
import TagsShowcases from "../_components/TagsShowcases";
import { authOptions } from "~/server/auth";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const q = searchParams.q;
  const currentUser = await getServerSession(authOptions)

  return (
    <main className="container mx-auto my-8 flex flex-col items-center gap-10 px-4 py-10">
      <SearchBar />
      <TagsShowcases tagName={q} />
      <GalleryNavbar user={currentUser?.user} />
    </main>
  );
}
