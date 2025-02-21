import Navbar from "../_components/Navbar";
import Feedbacks from "../_components/Feedbacks";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export default async function FeedbackPage() {
  const currentUser = await getServerSession(authOptions)
  return (
    <div className="container mx-auto flex h-screen flex-col items-center gap-6">
      <Navbar currentUser={currentUser?.user} />
      <Feedbacks currentUser={currentUser?.user} />
    </div>
  );
}
