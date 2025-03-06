import { getServerSession } from "next-auth"
import { authOptions } from "~/server/auth"
import SearchBar from "~/app/_components/SearchBar"
import Showcases from "~/app/_components/Showcases"

export default async function ShowcasesPage() {
    const currentUser = await getServerSession(authOptions)
    return (
        <section className="container mx-auto px-4 py-10 flex flex-col items-center gap-10 my-8">
            <SearchBar />
            <Showcases currentUser={currentUser?.user} />
        </section>
    )
}

