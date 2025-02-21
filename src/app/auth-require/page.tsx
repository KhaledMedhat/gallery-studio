import AuthRequired from "../_components/AuthRequired";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export default async function AuthRequirePage() {
    const currentUser = await getServerSession(authOptions)

    return (
        <AuthRequired currentUser={currentUser?.user} />
    )
}
