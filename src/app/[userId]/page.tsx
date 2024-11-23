export default async function UserPage({
    params: { userId: userId },
}: {
    params: { userId: string };
}) {
    return (
        <h1>{userId}</h1>
    )
}