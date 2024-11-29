import { headers } from 'next/headers'
import { api } from '~/trpc/server'
import NotFound from './_components/NotFound'

export default async function NotFoundPage() {
    const headersList = headers()
    const url = headersList.get('referer')
    const currentUser = await api.user.getUser();
    return (
        <NotFound currentUser={currentUser} url={url} />
    )
}