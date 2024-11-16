import { api } from "~/trpc/server";
import Navbar from "../_components/Navbar";
import FeedbackForm from "../_components/FeedbackForm";
import { ArrowDown } from "lucide-react";
import Feedback from "../_components/Feedback";
import BlurFade from "~/components/ui/blur-fade";

export default async function FeedbackPage() {
    const feedbacks = await api.feedback.allFeedbacks();
    return (
        <div className="container mx-auto">
            <Navbar />
            <div className="flex items-center gap-20 flex-col justify-center mt-12 w-full">
                <div className="w-full flex flex-wrap gap-4  justify-center">
                    {feedbacks.map((feedback) => (
                        <BlurFade key={feedback.id} delay={0.6} inView>
                            <Feedback feedback={feedback} />
                        </BlurFade>
                    ))}
                </div>
                <div className="w-full flex items-center flex-col gap-2">
                    <div className="flex gap-2 items-center">
                        Let us know about your experience with Gallery Studio from below <ArrowDown className="animate-bounce" size={16} />
                    </div>
                    <FeedbackForm />
                </div>
            </div>

        </div>
    )
}           