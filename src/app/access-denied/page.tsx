import PrivateGalleryAccessDenied from "../_components/PrivateGalleryAccessDenied";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export default async function AccessDeniedPage() {
    const currentUser = await getServerSession(authOptions)

    return (
        <PrivateGalleryAccessDenied currentUser={currentUser?.user} />
    )
}
