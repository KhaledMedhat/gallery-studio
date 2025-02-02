import GalleryNavbar from "~/app/_components/GalleryNavbar";
import UserSettings from "~/app/_components/UserSettings";
import { api } from "~/trpc/server";

export default async function UserSettingsPage({
    params: { username: username },
}: {
    params: { username: string };
}) {
    const currentUser = await api.user.getUser();
    return (
        <main className="m-4">
            <UserSettings currentUser={currentUser} />
            <GalleryNavbar user={currentUser} />
        </main>
    )
}