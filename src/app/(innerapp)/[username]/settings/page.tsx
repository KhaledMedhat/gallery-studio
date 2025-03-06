import { getServerSession } from "next-auth";
import UserSettings from "~/app/_components/UserSettings";
import { authOptions } from "~/server/auth";

export default async function UserSettingsPage() {
    const currentUser = await getServerSession(authOptions)

    return (
        <main className="m-4 min-h-[110vh]">
            <UserSettings currentUser={currentUser?.user} />
        </main>
    )
}