import { api } from "~/trpc/server"
import Showcases from "../_components/Showcases"
import GalleryNavbar from "../_components/GalleryNavbar"

export default async function ShowCasesPage() {
    const user = await api.user.getUser()
    return (
        <>
            {user && <GalleryNavbar />}
            <Showcases user={user} />
        </>
    )
}

