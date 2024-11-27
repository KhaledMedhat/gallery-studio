
import { api } from '~/trpc/server'
import Navbar from '../_components/Navbar'
import FeedbacksPage from '../_components/FeedbackPage';


export default async function FeedbackPage() {

    const currentUser = await api.user.getUser();
    return (
        <div className="container mx-auto flex flex-col items-center gap-60">
            <Navbar currentUser={currentUser}/>
            <FeedbacksPage />
        </div>
    )
}



