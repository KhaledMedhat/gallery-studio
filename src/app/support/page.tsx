import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ChevronLeft, HelpCircle, Mail, MessageCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Input } from '~/components/ui/input'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/server/auth'
import GalleryNavbar from '../_components/GalleryNavbar'

export const metadata: Metadata = {
    title: 'Support | Gallery Studio',
    description: 'Get help and support for Gallery Studio',
}

export default async function SupportPage() {
    const currentUser = await getServerSession(authOptions)
    return (
        <div className="container mx-auto px-4 py-8">
            {currentUser && <GalleryNavbar user={currentUser.user} />}
            <Button variant="link" className="p-0">
                <Link href={'/'} className='flex items-center gap-1'>
                    <ChevronLeft size={20} />
                    Back to home
                </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-8">Support</h1>

            <Tabs defaultValue="faq" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="contact">Contact Us</TabsTrigger>
                    <TabsTrigger value="help-center">Help Center</TabsTrigger>
                </TabsList>
                <TabsContent value="faq">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                            <CardDescription>Find quick answers to common questions about Gallery Studio.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>What is Gallery-Studio?</AccordionTrigger>
                                    <AccordionContent>
                                        Gallery-Studio is a social media platform designed for artists, photographers, and creators to share their work, interact with others, and build a community around visual storytelling.
                                        For more information about Gallery-Studio and its features, visit the <Button variant='link' className='p-0 font-bold'><Link href={'/about'}>About</Link></Button> page.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How do I create an account?</AccordionTrigger>
                                    <AccordionContent>
                                        To create an account, click on the &quot;Login&quot; button in the top right corner of the homepage. Either you login with your google account or press create account on the top right corner and fill in your details, including your email address and a secure password. Follow the verification process, and you&lsquo;re all set!
                                        You can click on Help Center then User Guide to get detailed information.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-">
                                    <AccordionTrigger>Is Gallery-Studio free to use?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes! The basic features of Gallery-Studio, including uploading images, commenting, and liking posts, are completely free. We may offer premium features in the future.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>How can I upload photos to my gallery?</AccordionTrigger>
                                    <AccordionContent>
                                        After logging in, you will find a custom navbar for you on the bottom corner that has add image icon with a plus in the top right corner of the icon. Click on the &quot;Add&quot; button, select the photos you want to share, add any captions or tags, and click &quot;Save&quot;. Your photos will now be visible in your gallery or in the showcases if its public.
                                        You can click on Help Center then User Guide to get detailed information.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>What file types are supported for uploads?</AccordionTrigger>
                                    <AccordionContent>
                                        Gallery Studio supports JPEG, PNG, and GIF file formats for image uploads. We also support MP4 for video uploads. The maximum file size for uploads is 20MB for images and 100MB for videos.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-6">
                                    <AccordionTrigger>Can I create albums to organize my images?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes! You can create albums to categorize your images. Simply go to your Gallery, click New Album, and start adding your work.
                                        You can click on Help Center then User Guide to get detailed information.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-7">
                                    <AccordionTrigger>How does the commenting and like system work?</AccordionTrigger>
                                    <AccordionContent>
                                        Users can comment on posts to share feedback or start discussions. Comments support text and emojis, you can like showcases, comments and replies by clicking the ❤️ icon, and you’ll receive a notification when someone replies.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-8">
                                    <AccordionTrigger>How do I follow other users?</AccordionTrigger>
                                    <AccordionContent>You can follow users by visiting their profile and clicking the Follow button. Their latest posts will appear in your feed.
                                        You can click on Help Center then User Guide to get detailed information.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-9">
                                    <AccordionTrigger>How do I customize my profile?</AccordionTrigger>
                                    <AccordionContent>
                                        Go to your Profile Settings from the custom navbar in the bottom corner, where you can change your profile picture, bio, and other details to personalize your account.
                                        You can click on Help Center then User Guide to get detailed information.

                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-10">
                                    <AccordionTrigger>Is Gallery-Studio available on mobile?</AccordionTrigger>
                                    <AccordionContent>
                                        Gallery-Studio is fully responsive and works on mobile browsers. A dedicated mobile app may be released in the future</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-11">
                                    <AccordionTrigger>How do I contact support?</AccordionTrigger>
                                    <AccordionContent>
                                        If you have any issues or questions, you can reach out to our support team through the Help Center or email us at support@gallery-studio.com.</AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Us</CardTitle>
                            <CardDescription>Get in touch with our support team for personalized assistance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Input id="name" placeholder="Your Name" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Input id="email" placeholder="Your Email" type="email" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Textarea placeholder="Describe your issue or question" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Send Message</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="help-center">
                    <Card>
                        <CardHeader>
                            <CardTitle>Help Center</CardTitle>
                            <CardDescription>Explore our resources to get the most out of Gallery Studio.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <BookOpen size={24} />
                                        <CardTitle>User Guide</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Comprehensive guide on how to use Gallery Studio features.</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" asChild>
                                            <Link href="/user-guide">Read Guide</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <HelpCircle size={24} />
                                        <CardTitle>Troubleshooting</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Solutions to common issues and error messages.</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" asChild>
                                            <Link href="/troubleshooting">View Solutions</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <MessageCircle size={24} />
                                        <CardTitle>Community Forum</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Connect with other users and share tips and tricks.</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" asChild>
                                            <Link href="/forum">Join Discussion</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Mail size={24} />
                                        <CardTitle>Email Support</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Get direct assistance from our support team via email.</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" asChild>
                                            <Link href="mailto:support@gallerystudio.com">Email Us</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}