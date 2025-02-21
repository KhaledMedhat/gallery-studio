"use client";
import React from "react";
import Image from "next/image";
import { LoaderCircle, Facebook, Twitter, Instagram } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { type Showcase as showcaseType, type User } from "~/types/types";
import { extractUsernameAndText, getInitials, typeOfFile } from "~/utils/utils";
import BlurFade from "~/components/ui/blur-fade";
import Link from "next/link";
import Video from "./Video";
import { useUserStore } from "~/store";
import { UpdateUserCoverImage, UpdateUserInfo } from "./UpdateUserProfile";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import SharedHoverCard from "./SharedHoverCard";

const UserProfile: React.FC<{
  user: User | null;
  files: showcaseType[];
  currentUser: User | null | undefined;
}> = ({ user, files, currentUser }) => {
  const router = useRouter();
  const sameUser = currentUser?.id === user?.id;
  const isInFollowing = currentUser?.followings?.find(
    (following) => following.id === user?.id,
  );
  const { setIsUserUpdating, isUserUpdating } = useUserStore();
  const utils = api.useUtils();
  const { mutate: followUser, isPending: isFollowing } =
    api.user.followUser.useMutation({
      onSuccess: () => {
        router.refresh();
        void utils.notification.getNotifications.invalidate();
        void utils.file.getShowcaseFiles.invalidate();
      },
    });
  const { mutate: unfollowUser, isPending: isUnfollowing } =
    api.user.unfollowUser.useMutation({
      onSuccess: () => {
        router.refresh();
        void utils.file.getShowcaseFiles.invalidate();
      },
    });
  const iconMap: Record<string, React.FC> = {
    Facebook: Facebook,
    Twitter: Twitter,
    Instagram: Instagram,
    // Add other icons as needed
  };
  return (
    <div className="min-h-screen">
      {/* Cover Photo */}
      <div className="relative h-64 lg:h-96">
        {isUserUpdating ? (
          <UpdateUserCoverImage
            coverImage={
              user?.coverImage
                ? user.coverImage
                : { imageUrl: "/image-3@2x.jpg", imageKey: "" }
            }
          />
        ) : (
          <Image
            src={
              user?.coverImage ? user.coverImage.imageUrl : "/image-3@2x.jpg"
            }
            alt={`${user?.coverImage ? `${user?.name}'s cover image` : `${user?.name}'s default cover photo`}`}
            fill
            style={{ objectFit: "contain" }}
          />
        )}
      </div>

      <div className="container relative z-20 mx-auto px-4 py-8">
        {/* Profile Info */}
        <Card className="z-50 mt-[-64px]">
          <CardContent className="pb-8 pt-16">
            {isUserUpdating ? (
              <UpdateUserInfo
                image={user?.profileImage}
                bio={user?.bio}
                name={user?.name}
                firstName={user?.firstName}
                lastName={user?.lastName}
              />
            ) : (
              <div className="mt-12 flex flex-col items-center gap-6 md:mt-0 md:flex-row md:items-start">
                <Avatar className="absolute left-1/2 top-0 flex h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-4 border-background md:left-8 md:translate-x-0">
                  <AvatarImage
                    src={user?.profileImage?.imageUrl ?? ""}
                    alt={user?.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                  <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-slate-500 text-3xl font-bold">
                    {getInitials(user?.firstName ?? "", user?.lastName ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:ml-40 md:text-left">
                  <h1 className="text-2xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-muted-foreground">@{user?.name}</p>
                  <div className="mt-2">
                    {extractUsernameAndText(user?.bio).previousText}
                    {" "}
                    {extractUsernameAndText(user?.bio).username && <SharedHoverCard
                      reply={extractUsernameAndText(user?.bio).username}
                      isCommentOrReply={true}
                    />}
                    {" "}
                    {extractUsernameAndText(user?.bio).followingText}

                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                    {user?.socialUrls?.map((socialUrl, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-full p-1">
                        <Link href={socialUrl.url}>
                          {iconMap[socialUrl.platformIcon] ? (
                            React.createElement(iconMap[socialUrl.platformIcon]!)
                          ) : null}
                        </Link>
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  disabled={isFollowing || isUnfollowing}
                  onClick={() => {
                    if (sameUser) {
                      setIsUserUpdating(true);
                    } else if (isInFollowing) {
                      unfollowUser({ id: user?.id ?? "" });
                    } else {
                      followUser({ id: user?.id ?? "" });
                    }
                  }}
                  className="md:self-start"
                >
                  {isFollowing || isUnfollowing ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : sameUser ? (
                    "Edit Profile"
                  ) : isInFollowing ? (
                    "Unfollow"
                  ) : (
                    "Follow"
                  )}
                </Button>
              </div>
            )}

            {/* User Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold"> {Number(files.length)}</p>
                <p className="capitalize text-muted-foreground">Showcases</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {" "}
                  {Number(user?.followers?.length)}
                </p>
                <p className="capitalize text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Number(user?.followings?.length)}
                </p>
                <p className="capitalize text-muted-foreground">Following</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* showcases tab section */}
        <Tabs defaultValue="showcases" className="mt-8">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="showcases" className="cursor-auto">
              Showcases
            </TabsTrigger>
          </TabsList>
          <TabsContent value="showcases">
            <Card>
              <CardHeader>
                <CardTitle>Showcases</CardTitle>
                <CardDescription>
                  View {user?.name}&apos;s latest showcases.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid h-full w-full grid-cols-3 gap-4 lg:grid-cols-4">
                {/* Add photo grid here */}
                {files.length > 0 ? (
                  files?.map((file, idx) => (
                    <BlurFade
                      key={file.id}
                      delay={0.25 + Number(idx) * 0.05}
                      inView
                    >
                      <Link href={`/showcases/${file.id}`}>
                        <div className="relative h-full w-full">
                          <div className="h-full max-w-[200px] lg:max-w-[400px]">
                            {typeOfFile(file.fileType) === "Image" ? (
                              <AspectRatio ratio={1 / 1}>
                                <Image
                                  priority
                                  src={file.url}
                                  alt={`Gallery image ${file.id}`}
                                  layout="fill"
                                  className={`h-full w-full cursor-pointer rounded-md object-cover`}
                                />
                              </AspectRatio>
                            ) : (
                              <Video
                                url={file.url}
                                showInitialPlayButton={false}
                              />
                            )}
                          </div>
                        </div>
                      </Link>
                    </BlurFade>
                  ))
                ) : sameUser ? (
                  <h1>No Showcases yet</h1>
                ) : (
                  <h1>{user?.name} has no showcases yet</h1>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
};

export default UserProfile;
