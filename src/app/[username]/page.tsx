import { api } from "~/trpc/server";
import UserProfile from "../_components/UserProfile";
import GalleryNavbar from "../_components/GalleryNavbar";

export default async function UserPage({
    params: { username: username },
}: {
    params: { username: string };
}) {
    const user = await api.user.getUserByUsername({ username })
    const currentUser = await api.user.getUser()
    const files = await api.file.getUserFiles({ id: user.id })
    return (
        <main>
            <GalleryNavbar user={currentUser} files={files} />
            <UserProfile user={user} files={files} currentUser={currentUser} />
        </main>
    )
}