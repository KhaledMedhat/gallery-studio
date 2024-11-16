import { api } from "~/trpc/server";
import Navbar from "../_components/Navbar";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default async function FeedbackPage() {
    const feedbacks = await api.feedback.allFeedbacks();
    console.log(feedbacks)
    return (
        <div>
            <Navbar />
            <div>
                Let us know about your experience with Gallery Studio <Button className="p-0 text-md" variant='link' asChild><Link href={'/feedback/add-feedback'}>here</Link></Button>
            </div>
        </div>
    )
}           