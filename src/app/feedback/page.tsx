import { api } from "~/trpc/server";
import Navbar from "../_components/Navbar";
import Feedbacks from "../_components/Feedbacks";

export default async function FeedbackPage() {
  const currentUser = await api.user.getUser();
  return (
    <div className="container mx-auto flex h-screen flex-col items-center gap-6">
      <Navbar currentUser={currentUser} />
      <Feedbacks currentUser={currentUser} />
    </div>
  );
}
