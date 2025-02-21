import type { Metadata } from 'next'
import { Camera, Lock, Edit, Share2, FolderPlus, Bell, User, LogIn, AtSign, Smartphone, Zap, Cloud, Users, Search, Trash2, Eye, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import { Badge } from '~/components/ui/badge'

export const metadata: Metadata = {
    title: 'About | Gallery Studio',
    description: 'Explore the powerful features of Gallery Studio, your ultimate platform for showcasing and sharing your art',
}

export default function AboutPage() {
    const features = [
        {
            icon: Camera,
            title: "Personal Galleries",
            description: "Create your own private gallery to showcase your work. Your space, your rules."
        },
        {
            icon: Lock,
            title: "Privacy Controls",
            description: "Choose who sees your work. Keep it private or share it with your followers."
        },
        {
            icon: Edit,
            title: "Image Editing",
            description: "Edit your images right on the platform before uploading to your gallery."
        },
        {
            icon: Share2,
            title: "Public Sharing",
            description: "Share your work publicly with your followers when you're ready to showcase."
        },
        {
            icon: FolderPlus,
            title: "Album Creation",
            description: "Organize your work into albums. Add from your gallery or upload new content."
        },
        {
            icon: Bell,
            title: "Real-time Notifications",
            description: "Stay updated with real-time notifications for new followers, likes, comments, and more."
        },
        {
            icon: User,
            title: "User Profiles",
            description: "Customize your profile with a bio, social media links, and showcase your public work."
        },
        {
            icon: LogIn,
            title: "Easy Authentication",
            description: "Sign up or log in seamlessly using credentials or Google authentication."
        },
        {
            icon: AtSign,
            title: "Mention System",
            description: "Mention and engage with your followers in comments and posts."
        },
        {
            icon: Smartphone,
            title: "Responsive Design",
            description: "Enjoy a smooth experience across all devices with our responsive design."
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Experience rapid load times and smooth interactions throughout the platform."
        },
        {
            icon: Cloud,
            title: "Cloud Infrastructure",
            description: "Benefit from our robust cloud-based infrastructure for reliability and scalability."
        },
        {
            icon: Users,
            title: "Vibrant Community",
            description: "Join a thriving community of artists. Ask questions, share insights, and grow together."
        },
        {
            icon: Search,
            title: "Powerful Search",
            description: "Find artists or showcases easily using our advanced search functionality and tagging system."
        },
        {
            icon: Trash2,
            title: "Content Management",
            description: "Edit or delete your showcases and albums at any time, maintaining full control over your content."
        },
        {
            icon: Eye,
            title: "Flexible Privacy",
            description: "Adjust the privacy settings of your showcases anytime, from private to public and vice versa."
        },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="link" className="p-0">
                <Link href={'/'} className='flex items-center gap-1'>
                    <ChevronLeft size={20} />
                    Back to home
                </Link>
            </Button>
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-6">About Gallery Studio</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                    Studio is a next-gen social media platform designed for artists to showcase their work in a private or public gallery. Whether you&lsquo;re a photographer, designer, or digital artist, Studio gives you full control over your creative space.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                            <feature.icon className="w-4 h-4 inline mr-1" />
                            {feature.title}
                        </Badge>
                    ))}
                </div>
                <Button size="lg" className="font-semibold">
                    <Link href={'/sign-in'}>
                        Join Gallery Studio Today
                    </Link>
                </Button>
            </section>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <feature.icon className="w-10 h-10 mb-2 text-primary" />
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p>{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <section className="text-center bg-primary text-primary-foreground mt-16  p-8 rounded-lg">
                <h2 className="text-3xl font-semibold mb-4">Ready to Showcase Your Art?</h2>
                <p className="mb-6 max-w-2xl mx-auto">
                    Join Gallery Studio today and experience the perfect platform for artists to share, connect, and grow.
                </p>
                <Button size="lg" variant="secondary">
                    <Link href="/sign-up">Sign Up Now</Link>
                </Button>
            </section>
        </div>
    )
}