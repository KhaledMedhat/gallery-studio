import { api } from "~/trpc/server"
import Image from "next/legacy/image"

export default async function ShowCasesPage() {
    const showcaseFiles = await api.file.getShowcaseFiles()
    return (
        showcaseFiles.map((file, idx) => (
            <div key={file.id} className="relative w-full h-full overflow-hidden rounded-lg">
                <Image src={file.url} alt={`One of ${file.caption}'s images`} width={100} height={100} className="w-full h-full blur-[1px] object-cover" />
            </div>
        ))
    )
}