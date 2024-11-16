import Navbar from "~/app/_components/Navbar";
import { api } from "~/trpc/server";

export default async function FeedbackPage() {

    return (
        <div>
            <Navbar />
            <h1>add feedback</h1>
        </div>
    )
}           