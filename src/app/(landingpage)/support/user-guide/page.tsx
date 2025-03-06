import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Camera, Users, Settings } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

export const metadata: Metadata = {
  title: 'User Guide | Gallery Studio',
  description: 'Comprehensive guide on how to use Gallery Studio features',
}

export default function UserGuidePage() {
  return (
    <div className="container mt-36 mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Gallery Studio User Guide</h1>

      <Tabs defaultValue="getting-started" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="uploading">Uploading</TabsTrigger>
          <TabsTrigger value="social">Social Features</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Gallery Studio</CardTitle>
              <CardDescription>Learn the basics of using Gallery Studio</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Creating your account</li>
                <li>Setting up your profile</li>
                <li>Navigating the interface</li>
                <li>Understanding privacy settings</li>
                <li>Exploring featured galleries</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/user-guide/getting-started">Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="uploading">
          <Card>
            <CardHeader>
              <CardTitle>Uploading and Managing Your Photos</CardTitle>
              <CardDescription>Master the art of sharing your best shots</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Uploading photos and videos</li>
                <li>Organizing your gallery</li>
                <li>Adding captions and tags</li>
                <li>Editing and enhancing your images</li>
                <li>Creating albums and collections</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/user-guide/uploading">Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Features and Interaction</CardTitle>
              <CardDescription>Connect with other photographers and enthusiasts</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Following other users</li>
                <li>Liking and commenting on photos</li>
                <li>Sharing galleries and individual images</li>
                <li>Participating in challenges and contests</li>
                <li>Building your network</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/user-guide/social">Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Managing Your Account Settings</CardTitle>
              <CardDescription>Customize your Gallery Studio experience</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Updating your profile information</li>
                <li>Adjusting privacy and security settings</li>
                <li>Managing notifications</li>
                <li>Linking social media accounts</li>
                <li>Subscription and billing options</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/user-guide/settings">Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}