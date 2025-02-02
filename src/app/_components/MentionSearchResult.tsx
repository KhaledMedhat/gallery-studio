import { LoaderCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import type { User } from "~/types/types"
import { getInitials } from "~/utils/utils"

const MentionSearchResult: React.FC<{

    isMentionSearchPending: boolean,
    followings: User[] | undefined | null
}> = ({

    isMentionSearchPending, followings }) => {
        return (
            <Card className="flex w-full flex-col rounded-md p-2">
                {isMentionSearchPending ?
                    <LoaderCircle size={25} className="m-auto animate-spin" />
                    : followings?.length === 0 ? <div className="text-center">You haven&apos;t followed anyone yet.</div> : followings?.map((following) => (
                        <Button
                            key={following.id}
                            variant='ghost'
                            className="flex w-full items-center justify-start gap-2 rounded-md p-2 hover:bg-accent"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={following?.profileImage?.imageUrl ?? ""} />
                                <AvatarFallback>
                                    {getInitials(
                                        following?.firstName ?? "",
                                        following?.lastName ?? "",
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-bold">{following?.name}</p>
                        </Button>
                    ))}
            </Card>
        )
    }
export default MentionSearchResult