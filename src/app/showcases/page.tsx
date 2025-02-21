import { api } from "~/trpc/server"
import Showcases from "../_components/Showcases"
import GalleryNavbar from "../_components/GalleryNavbar"
import SearchBar from "../_components/SearchBar"
import { getServerSession } from "next-auth"
import { authOptions } from "~/server/auth"

export default async function ShowcasesPage() {
    const files = await api.file.getFiles()
    const currentUser = await getServerSession(authOptions)
    return (
        <section className="container mx-auto px-4 py-10 flex flex-col items-center gap-10 my-8">
            <SearchBar />
            <Showcases currentUser={currentUser?.user} />
            {currentUser && <GalleryNavbar user={currentUser?.user} files={files} />}
        </section>
    )
}

