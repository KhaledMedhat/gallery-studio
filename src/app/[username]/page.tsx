export default async function UserPage({
    params: { username: username },
}: {
    params: { username: string };
}) {
    return (
        <h1>{username}</h1>
    )
}