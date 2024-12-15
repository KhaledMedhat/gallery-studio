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

const Showcases: React.FC<{ currentUser: User | undefined | null }> = ({ currentUser }) => {
    const { data: showcaseFiles } = api.file.getShowcaseFiles.useQuery()

    if (showcaseFiles?.length === 0) return <div className="flex flex-col items-center justify-center h-screen">
        <SearchBar />
        <h1 className="text-2xl">No showcases yet. look up from the search bar and follow people to have a feed of their work</h1>
    </div>
    return (
        <div className="w-full lg:w-3/5 ">
            {showcaseFiles?.map((file, idx) => (
                <BlurFade className="flex gap-4 flex-col" key={file.id} delay={0.25 + Number(idx) * 0.05} inView>
                    <Showcase file={file} currentUser={currentUser} />
                    {idx < showcaseFiles.length - 1 && <Separator />}
                </BlurFade>
            ))}
        </div>
    )
}

export default Showcases