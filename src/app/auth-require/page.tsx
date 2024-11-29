import { api } from "~/trpc/server";
import AuthRequired from "../_components/AuthRequired";

export default async function AuthRequirePage() {
    const currentUser = await api.user.getUser()
    return (
        <AuthRequired currentUser={currentUser} />
    )
}
