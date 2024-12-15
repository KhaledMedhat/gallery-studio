"use client"
import React from 'react'
import Image from 'next/image'
import { Camera, ImageIcon, LoaderCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { type Showcase as showcaseType, type User } from '~/types/types'
import { getInitials, typeOfFile } from '~/utils/utils'
import BlurFade from '~/components/ui/blur-fade'
import Link from 'next/link'
import Video from './Video'
import { useUserStore } from '~/store'
import { UpdateUserCoverImage, UpdateUserInfo } from './UpdateUserProfile'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'

const UserProfile: React.FC<{ user: User | null, files: showcaseType[], currentUser: User | null | undefined }> = ({ user, files, currentUser }) => {
    const router = useRouter()
    const sameUser = currentUser?.id === user?.id
    const isInFollowing = currentUser?.followings?.find(following => following.userId === user?.id)
    const { setIsUserUpdating, isUserUpdating } = useUserStore()
    const utils = api.useUtils()
    const { mutate: followUser, isPending: isFollowing } = api.user.followUser.useMutation({
        onSuccess: () => {
            router.refresh()
            void utils.file.getShowcaseFiles.invalidate()
        }
    })
    const { mutate: unfollowUser, isPending: isUnfollowing } = api.user.unfollowUser.useMutation({
        onSuccess: () => {
            router.refresh()
            void utils.file.getShowcaseFiles.invalidate()
        }
    })
    return (

        <div className="min-h-screen">
            {/* Cover Photo */}
            <div className="relative h-[20rem] md:h-64 lg:h-96">
                {isUserUpdating ? <UpdateUserCoverImage coverImage={user?.coverImage ? user.coverImage : '/image-3@2x.jpg'} /> : <Image
                    src={user?.coverImage ? user.coverImage : '/image-3@2x.jpg'}
                    alt={`${user?.coverImage ? `${user?.name}'s cover image` : `${user?.name}'s default cover photo`}`}
                    fill
                    className="object-cover"
                />}
            </div>

            <div className="container relative z-20 mx-auto px-4 py-8">
                {/* Profile Info */}
                <Card className="mt-[-64px] z-50">
                    <CardContent className="pt-16 pb-8">
                        {isUserUpdating ? <UpdateUserInfo image={user?.image} bio={user?.bio} name={user?.name} firstName={user?.firstName} lastName={user?.lastName} /> : <div className="flex mt-12 md:mt-0 flex-col md:flex-row items-center md:items-start gap-6">
                            <Avatar className="w-[10rem] h-[10rem] flex items-center justify-center border-4 rounded-full border-background absolute top-0 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2">
                                <AvatarImage src={user?.image ?? ''} alt={user?.name} className='rounded-full w-full h-full object-cover' />
                                <AvatarFallback className='text-3xl font-bold bg-slate-500 w-full h-full rounded-full flex items-center justify-center'>{getInitials(user?.firstName ?? "", user?.lastName ?? "")}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-center md:text-left md:ml-40">
                                <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
                                <p className="text-muted-foreground">@{user?.name}</p>
                                <p className="mt-2">{user?.bio}</p>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                    <Badge variant="secondary">
                                        <Camera className="w-4 h-4 mr-1" />
                                        Photographer
                                    </Badge>
                                    <Badge variant="secondary">
                                        <ImageIcon className="w-4 h-4 mr-1" />
                                        Digital Artist
                                    </Badge>
                                </div>
                            </div>
                            <Button
                                disabled={isFollowing || isUnfollowing}
                                onClick={() => {
                                    if (sameUser) {
                                        setIsUserUpdating(true)
                                    } else if (isInFollowing) {
                                        unfollowUser({ id: user?.id ?? "" })
                                    } else {
                                        followUser({ id: user?.id ?? "" })

                                    }
                                }} className="md:self-start">{isFollowing || isUnfollowing ? <LoaderCircle size={20} className="animate-spin" /> : sameUser ? 'Edit Profile' : isInFollowing ? 'Unfollow' : 'Follow'}</Button>
                        </div>}

                        {/* User Stats */}
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold"> {Number(files.length)}</p>
                                <p className="text-muted-foreground capitalize">Showcases</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold"> {Number(user?.followers?.length)}</p>
                                <p className="text-muted-foreground capitalize">Followers</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{Number(user?.followings?.length)}</p>
                                <p className="text-muted-foreground capitalize">Following</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for different sections */}
                <Tabs defaultValue="showcases" className="mt-8">
                    <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="showcases" className='cursor-auto'>Showcases</TabsTrigger>
                    </TabsList>
                    <TabsContent value="showcases">
                        <Card>
                            <CardHeader>
                                <CardTitle>Showcases</CardTitle>
                                <CardDescription>View {user?.name}&apos;s latest showcases.</CardDescription>
                            </CardHeader>
                            <CardContent className='grid w-full h-full grid-cols-2 md:grid-cols-4 gap-4'>
                                {/* Add photo grid here */}
                                {files.length > 0 ? files?.map((file, idx) => (
                                    <BlurFade key={file.id} delay={0.25 + Number(idx) * 0.05} inView>
                                        <Link href={`/showcases/${file.id}`}>
                                            {typeOfFile(file.fileType) === 'Image' ?
                                                <div className="h-[300px] max-w-full relative">
                                                    <Image
                                                        priority
                                                        src={file.url}
                                                        alt={`Gallery image ${file.id}`}
                                                        layout="fill"
                                                        className={`h-full w-full cursor-pointer rounded-md object-cover`}

                                                    />
                                                </div>
                                                : <Video url={file.url} showInitialPlayButton={false} />
                                            }

                                        </Link>
                                    </BlurFade>
                                )) :
                                    sameUser ? <h1>No Showcases yet</h1> : <h1>{user?.name} has no showcases yet</h1>

                                }
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default UserProfile