import { api } from "~/trpc/server"
import Showcases from "../_components/Showcases"
import GalleryNavbar from "../_components/GalleryNavbar"
import SearchBar from "../_components/SearchBar"

export default async function ShowcasesPage() {
    const currentUser = await api.user.getUser()
    const files = await api.file.getFiles()
    return (
        <section className="container mx-auto px-4 py-10 flex flex-col items-center gap-10 my-8">
            <SearchBar />
            <Showcases currentUser={currentUser} />
            {currentUser && <GalleryNavbar user={currentUser} files={files} />}
        </section>
    )
}

