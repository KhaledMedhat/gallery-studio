import { AlertCircle, Home } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import BlurFade from '~/components/ui/blur-fade'
import { Button } from '~/components/ui/button'
import Navbar from './_components/Navbar'

export default async function NotFound() {
    const headersList = headers()
    const url = headersList.get('referer')
    console.log(url)
    return (
        <BlurFade delay={0.6} inView>
            <Navbar />
            <div className='flex items-center justify-center h-screen'>
                <div className='flex flex-col items-center gap-6'>
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mx-auto mb-4">
                        <AlertCircle size={40} color="brown" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">404 - Not Found</h1>
                    <p className="text-center">
                        Oops! {url} you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <p className="text-center">
                        It seems you&apos;ve went to wrong place. Don&apos;t worry, we&apos;ll help you find your way back.
                    </p>
                    <div className="flex justify-center space-y-2 w-full">
                        <Button asChild className="w-1/2">
                            <Link href={'/'} className="flex items-center gap-2">
                                <Home size={20} /> Go to Homepage
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </BlurFade>
    )
}