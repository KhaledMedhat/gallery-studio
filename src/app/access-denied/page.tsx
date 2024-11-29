import { api } from "~/trpc/server";
import PrivateGalleryAccessDenied from "../_components/PrivateGalleryAccessDenied";

export default async function AccessDeniedPage() {
    const currentUser = await api.user.getUser()
    return (
        <PrivateGalleryAccessDenied currentUser={currentUser} />
    )
}
