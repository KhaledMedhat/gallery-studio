import FileFullView from "~/app/_components/FileFullView";
import { api } from "~/trpc/server";

export default async function ShowCasesFilePage({
    params: { fileId: fileId },
}: {
    params: { fileId: string };
}) {
    const user = await api.user.getUser();
    const file = await api.file.getFileById({ id: fileId });
    return (
        <FileFullView user={user} file={file} />
    )
}

