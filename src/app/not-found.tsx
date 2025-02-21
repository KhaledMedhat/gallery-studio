import { headers } from 'next/headers'
import NotFound from './_components/NotFound'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/server/auth'

export default async function NotFoundPage() {
    const headersList = headers()
    const url = headersList.get('referer')
    const currentUser = await getServerSession(authOptions)
    return (
        <NotFound currentUser={currentUser?.user} url={url} />
    )
}