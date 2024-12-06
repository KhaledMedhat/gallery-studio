'use client'
import dayjs from "dayjs"
import { api } from "~/trpc/react"
import relativeTime from "dayjs/plugin/relativeTime";
import type { User } from "~/types/types"
import Showcase from "./Showcase"
import { Separator } from "~/components/ui/separator";
import BlurFade from "~/components/ui/blur-fade";
import SearchBar from "./SearchBar";
dayjs.extend(relativeTime);

const Showcases: React.FC<{ user: User | undefined | null }> = ({ user }) => {
    const { data: showcaseFiles } = api.file.getShowcaseFiles.useQuery()

    if (showcaseFiles?.length === 0) return <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl">No showcases yet. follow people to have a feed of their work</h1>
    </div>
    return (
        <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-10 my-8">
            <SearchBar />
            <div className="w-full lg:w-3/5 flex flex-col gap-4">
                {showcaseFiles?.map((file, idx) => (
                    <BlurFade key={file.id} delay={0.25 + Number(idx) * 0.05} inView>
                        <div className="flex gap-4 flex-col">
                            <Showcase file={file} user={user} />
                            {idx < showcaseFiles.length - 1 && <Separator />}
                        </div>
                    </BlurFade>
                ))}

            </div>
        </div >
    )
}

export default Showcases