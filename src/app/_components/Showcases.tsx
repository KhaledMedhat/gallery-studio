'use client'
import dayjs from "dayjs"
import { api } from "~/trpc/react"
import relativeTime from "dayjs/plugin/relativeTime";
import type { User } from "~/types/types"
import Showcase from "./Showcase"
import { Separator } from "~/components/ui/separator";
import BlurFade from "~/components/ui/blur-fade";
dayjs.extend(relativeTime);

const Showcases: React.FC<{ user: User | undefined | null }> = ({ user }) => {
    const { data: showcaseFiles } = api.file.getShowcaseFiles.useQuery()

    if (showcaseFiles?.length === 0) return <h1>no showcases yet follow people to have a feed of their work</h1>
    return (
        <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-6 my-8">
            <div className="w-1/2 flex flex-col gap-4">
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