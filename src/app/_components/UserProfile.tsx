"use client"

import React from 'react'
import Image from 'next/image'
import { Camera, ImageIcon, Heart, Eye, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { type Showcase as showcaseType, type User } from '~/types/types'
import { getInitials } from '~/utils/utils'
import BlurFade from '~/components/ui/blur-fade'
import Showcase from './Showcase'
import { Separator } from '~/components/ui/separator'

// Mock user data - replace with actual data fetching in a real application
const fsfs = {
    name: "Jane Doe",
    username: "@janedoe",
    bio: "Photography enthusiast | Nature lover | Capturing moments",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    coverPhotoUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=600&fit=crop",
    stats: {
        galleries: 12,
        photos: 248,
        followers: 1024,
        following: 356
    }
}

const UserProfile: React.FC<{ user: User | null, files: showcaseType[], currentUser: User | null | undefined }> = ({ user, files, currentUser }) => {
    const sameUser = currentUser?.id === user?.id

    return (
        <div className="min-h-screen bg-background">
            {/* Cover Photo */}
            <div className="relative h-[20rem] md:h-64 lg:h-96">
                <Image
                    src={user?.coverImage ? user.coverImage : '/image-3@2x.jpg'}
                    alt={`${user?.coverImage ? `${user?.name}'s cover photo` : `${user?.name}'s default cover photo`}`}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="container relative z-20 mx-auto px-4 py-8">
                {/* Profile Info */}
                <Card className="mt-[-64px] z-50">
                    <CardContent className="pt-16 pb-8">
                        <div className="flex mt-12 md:mt-0 flex-col md:flex-row items-center md:items-start gap-6">
                            <Avatar className="w-[10rem] h-[10rem] border-4 rounded-full border-background absolute top-0 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2">
                                <AvatarImage src={user?.image ?? ''} alt={user?.name} className='rounded-full w-full h-full' />
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
                            <Button className="md:self-start">{sameUser ? 'Edit Profile' : 'Follow'}</Button>
                        </div>

                        {/* User Stats */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            {Object.entries(fsfs.stats).map(([key, value]) => (
                                <div key={key} className="p-2">
                                    <p className="text-2xl font-bold">{value}</p>
                                    <p className="text-muted-foreground capitalize">{key}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for different sections */}
                <Tabs defaultValue="showcases" className="mt-8">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="showcases">Showcases</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>
                    <TabsContent value="showcases">
                        <Card>
                            <CardHeader>
                                <CardTitle>Showcases</CardTitle>
                                <CardDescription>View {user?.name}&apos;s latest showcases.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Add photo grid here */}
                                {files?.map((file, idx) => (
                                    <BlurFade key={file.id} delay={0.25 + Number(idx) * 0.05} inView>
                                        <div className="flex gap-4 flex-col">
                                            <Showcase file={file} user={currentUser} />
                                            {idx < files.length - 1 && <Separator />}
                                        </div>
                                    </BlurFade>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="achievements">
                        <Card>
                            <CardHeader>
                                <CardTitle>Achievements</CardTitle>
                                <CardDescription>{user?.name}&apos;s photography milestones and awards.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Award className="w-5 h-5 mr-2 text-yellow-500" />
                                        <span>Best Landscape Photo 2023</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Heart className="w-5 h-5 mr-2 text-red-500" />
                                        <span>1000+ Likes Milestone</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Eye className="w-5 h-5 mr-2 text-blue-500" />
                                        <span>Featured Photographer of the Month</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default UserProfile