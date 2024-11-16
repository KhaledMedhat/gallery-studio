import { Card } from "~/components/ui/card"
import { type Feedback } from "~/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitials } from "~/utils/utils";
const Feedback: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
    return (
        <Card key={feedback.id} className="w-[300px] p-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={feedback.user?.image ?? ""} />
                            <AvatarFallback>{getInitials(feedback.user?.name ?? "")}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="text-sm font-medium">{feedback.user.name}</div>
                            <div className="text-xs text-gray-500">{feedback.user.email}</div>
                        </div>
                    </div>
                </div>
                <p className="text-sm">{feedback.feedback}</p>
            </div>
        </Card>
    )
}

export default Feedback