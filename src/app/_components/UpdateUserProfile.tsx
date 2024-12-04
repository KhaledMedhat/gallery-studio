import { Button } from "~/components/ui/button"
import { useFileStore, useUserStore } from "~/store"
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Camera, Check, ImageIcon, LoaderCircle, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import UploadthingButton from "./UploadthingButton"
import { useState } from "react"
import { getInitials } from "~/utils/utils"
import AnimatedCircularProgressBar from "~/components/ui/animated-circular-progress-bar"
import { deleteFileOnServer } from "../actions"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { useTheme } from "next-themes"
import { api } from "~/trpc/react"
import { toast } from "~/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { featuredArtworks } from "~/constants/Images"
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"

export const UpdateUserCoverImage: React.FC<{ coverImage: string }> = ({ coverImage }) => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [checkedFile, setCheckedFile] = useState<{ id: number, title: string, artist: string, imageUrl: string } | undefined>(undefined);
    const theme = useTheme()
    const {
        fileUrl,
        fileKey,
        isUploading,
        progress,
        setFileUrl,
        setFileKey,
    } = useFileStore();
    const { setIsUserUpdating } = useUserStore()

    const router = useRouter()
    const { mutate: UpdateUserCoverImage, isPending: isUpdatingUserCoverImagePending } = api.user.updateUserProfile.useMutation({
        onSuccess: () => {
            setFileUrl("");
            setFileKey("");
            setCheckedFile(undefined)
            setIsUserUpdating(false);
            toast({
                title: "Updated Successfully.",
                description: `Your profile cover image has been updated successfully.`,

            });
            router.refresh()
        },
        onError: () => {
            toast({
                title: "Uh oh! Something went wrong.",
                description: `Uh oh! Something went wrong. Please try again.`,
            });
        },
    });
    const handleUpdateCoverImage = () => {
        if (fileUrl && checkedFile) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `You cant  upload both image you only need either upload image or select from the default.`,
            });
        } else if (checkedFile) {
            UpdateUserCoverImage({
                coverImage: checkedFile.imageUrl,
            })
        } else if (fileUrl) {
            UpdateUserCoverImage({
                coverImage: fileUrl,
            })
        }

    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button asChild className="w-full h-full cursor-pointer p-0">
                    <div className="w-full h-full">
                        <Image
                            src={coverImage}
                            alt='Cover Image'
                            fill
                            className="object-cover"
                        />
                        <div className="flex h-full w-full items-center justify-center z-10 bg-background/60">
                            <Plus className="!w-[50px] !h-[50px]" />
                        </div>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="h-fit max-h-full overflow-y-auto max-w-2xl xl:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Upload Cover Image</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile cover image here.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="upload-new-cover-image" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload-new-cover-image">Upload new cover image</TabsTrigger>
                        <TabsTrigger value="add-default">Add from our default</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload-new-cover-image">
                        {file && fileUrl && progress === 100 ? <div className="relative flex flex-col items-center justify-center gap-6">

                            <AspectRatio ratio={16 / 9}>
                                <Image
                                    src={fileUrl}
                                    alt="Profile Cover Image"
                                    layout="fill"
                                    className="h-full w-full cursor-pointer object-cover"
                                />
                            </AspectRatio>

                            <Button
                                className="absolute right-0 top-0"
                                type="button"
                                variant="ghost"
                                onClick={async () => {
                                    if (fileKey) {
                                        await deleteFileOnServer(fileKey);
                                        setFile(undefined);
                                        setFileUrl("");
                                    }
                                }}
                            >
                                <X size={20} />
                            </Button>
                        </div> :
                            isUploading && progress !== 0 ? (
                                <AnimatedCircularProgressBar
                                    className="m-auto"
                                    max={100}
                                    min={0}
                                    value={progress}
                                    gaugePrimaryColor={
                                        theme.resolvedTheme === "dark" ? "#d4d4d4" : "#171717"
                                    }
                                    gaugeSecondaryColor={
                                        theme.resolvedTheme === "dark" ? "#171717" : "#d4d4d4"
                                    }
                                />
                            ) : (
                                <UploadthingButton
                                    setFile={setFile}
                                    label={"Cover Image"}
                                />)

                        }
                    </TabsContent>
                    <TabsContent value="add-default" >
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            {featuredArtworks.map((artwork) => (
                                <div key={artwork.id} className="relative cursor-pointer" onClick={() => setCheckedFile(artwork)}>
                                    <Checkbox
                                        checked={checkedFile?.id === artwork.id}
                                        className={`absolute hidden right-2 top-2 z-10 items-center justify-center bg-muted ${checkedFile?.id === artwork.id && 'block'}`}
                                    />
                                    <Image src={artwork.imageUrl} alt={artwork.title} width={200} height={200} className="w-full h-full object-cover rounded-md" />
                                </div>
                            ))}
                        </div>

                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button
                        disabled={isUpdatingUserCoverImagePending || !fileUrl || !checkedFile}
                        onClick={handleUpdateCoverImage}>
                        {isUpdatingUserCoverImagePending ? <LoaderCircle size={20} className="animate-spin" /> : '  Save changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export const UpdateUserInfo: React.FC<{ image: string | undefined | null, name: string | undefined | null, bio: string | undefined | null, firstName: string | undefined | null, lastName: string | undefined | null }> = ({ image, name, bio, firstName, lastName }) => {
    const [updatedBio, setUpdatedBio] = useState<string | undefined | null>(bio)
    const [file, setFile] = useState<File | undefined>(undefined);
    const theme = useTheme()
    const {
        fileUrl,
        fileKey,
        isUploading,
        progress,
        setFileUrl,
        setFileKey,
    } = useFileStore();
    const { setIsUserUpdating } = useUserStore()

    const router = useRouter()
    const { mutate: UpdateUserCoverImage, isPending: isUpdatingUserCoverImagePending } = api.user.updateUserProfile.useMutation({
        onSuccess: () => {
            setFileUrl("");
            setFileKey("");
            setIsUserUpdating(false);
            toast({
                title: "Updated Successfully.",
                description: `Your profile has been updated successfully.`,

            });
            router.refresh()
        },
        onError: () => {
            toast({
                title: "Uh oh! Something went wrong.",
                description: `Uh oh! Something went wrong. Please try again.`,
            });
        },
    });
    const handleUpdateCoverImage = () => {
        UpdateUserCoverImage({
            image: fileUrl,
        })
    }
    const handleBioChange = () => {
        if (updatedBio) {
            UpdateUserCoverImage({
                bio: updatedBio,
            })
        }

    }

    return (
        <div className="flex mt-12 md:mt-0 flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-[10rem] h-[10rem] border-4 rounded-full border-background absolute top-0 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2">
                <AvatarImage src={image ?? ''} alt={name ?? ''} className='rounded-full w-full h-full' />
                <div className="flex h-full w-full items-center absolute cursor-pointer justify-center z-10 bg-background/60">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Plus className="!w-[50px] !h-[50px]" />
                        </DialogTrigger>
                        <DialogContent className="w-[400px]">
                            <DialogHeader>
                                <DialogTitle>Upload Profile Image</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile image here.
                                </DialogDescription>
                            </DialogHeader>

                            {file && fileUrl && progress === 100 ? <div className="relative flex flex-col items-center justify-center gap-6">

                                <AspectRatio ratio={1 / 1}>
                                    <Image
                                        src={fileUrl}
                                        alt="Profile Cover Image"
                                        layout="fill"
                                        className="h-full w-full cursor-pointer rounded-full object-cover"
                                    />
                                </AspectRatio>

                                <Button
                                    className="absolute right-0 top-0"
                                    type="button"
                                    variant="ghost"
                                    onClick={async () => {
                                        if (fileKey) {
                                            await deleteFileOnServer(fileKey);
                                            setFile(undefined);
                                            setFileUrl("");
                                        }
                                    }}
                                >
                                    <X size={20} />
                                </Button>
                            </div> :
                                isUploading && progress !== 0 ? (
                                    <AnimatedCircularProgressBar
                                        className="m-auto"
                                        max={100}
                                        min={0}
                                        value={progress}
                                        gaugePrimaryColor={
                                            theme.resolvedTheme === "dark" ? "#d4d4d4" : "#171717"
                                        }
                                        gaugeSecondaryColor={
                                            theme.resolvedTheme === "dark" ? "#171717" : "#d4d4d4"
                                        }
                                    />
                                ) : (
                                    <UploadthingButton
                                        setFile={setFile}
                                        label={"Cover Image"}
                                    />)

                            }

                            <DialogFooter>
                                <Button
                                    disabled={isUpdatingUserCoverImagePending}
                                    onClick={handleUpdateCoverImage}>
                                    {isUpdatingUserCoverImagePending ? <LoaderCircle size={20} className="animate-spin" /> : '  Save changes'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <AvatarFallback className='text-3xl font-bold bg-slate-500 w-full h-full rounded-full flex items-center justify-center'>{getInitials(firstName ?? "", lastName ?? "")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left md:ml-40">
                <h1 className="text-2xl font-bold">{firstName} {lastName}</h1>
                <p className="text-muted-foreground">@{name}</p>
                <div className="flex items-center gap-2 w-full">
                    <Input placeholder='About you' value={updatedBio!} onChange={(e) => setUpdatedBio(e.target.value)} className="mt-2" />
                    <Button variant='ghost' className="hover:bg-transparent" onClick={handleBioChange}>
                        <Check size={20} />
                    </Button>
                </div>
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
            <Button onClick={() =>
                setIsUserUpdating(false)} className="md:self-start">Cancel</Button>
        </div>
    )
}





// const UpdateUserProfile = () => {
//     const { setIsUserUpdating, isUserUpdating } = useUserStore()

//     return (

//         <div className="min-h-screen">
//             {/* Cover Photo */}
//             <div className="relative h-[20rem] md:h-64 lg:h-96">
//                 <Image
//                     src={user?.coverImage ? user.coverImage : '/image-3@2x.jpg'}
//                     alt={`${user?.coverImage ? `${user?.name}'s cover photo` : `${user?.name}'s default cover photo`}`}
//                     fill
//                     className="object-cover"
//                 />
//             </div>

//             <div className="container relative z-20 mx-auto px-4 py-8">
//                 {/* Profile Info */}
//                 <Card className="mt-[-64px] z-50">
//                     <CardContent className="pt-16 pb-8">
//                         <div className="flex mt-12 md:mt-0 flex-col md:flex-row items-center md:items-start gap-6">
//                             <Avatar className="w-[10rem] h-[10rem] border-4 rounded-full border-background absolute top-0 left-1/2 md:left-8 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2">
//                                 <AvatarImage src={user?.image ?? ''} alt={user?.name} className='rounded-full w-full h-full' />
//                                 <AvatarFallback className='text-3xl font-bold bg-slate-500 w-full h-full rounded-full flex items-center justify-center'>{getInitials(user?.firstName ?? "", user?.lastName ?? "")}</AvatarFallback>
//                             </Avatar>
//                             <div className="flex-1 text-center md:text-left md:ml-40">
//                                 <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
//                                 <p className="text-muted-foreground">@{user?.name}</p>
//                                 <p className="mt-2">{user?.bio}</p>
//                                 <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
//                                     <Badge variant="secondary">
//                                         <Camera className="w-4 h-4 mr-1" />
//                                         Photographer
//                                     </Badge>
//                                     <Badge variant="secondary">
//                                         <ImageIcon className="w-4 h-4 mr-1" />
//                                         Digital Artist
//                                     </Badge>
//                                 </div>
//                             </div>
//                             <Button onClick={() => setIsUserUpdating(false)} className="md:self-start">Cancel</Button>
//                         </div>

//                         {/* User Stats */}
//                         <div className="mt-8 grid grid-cols-3 gap-4 text-center">
//                             <div>
//                                 <p className="text-2xl font-bold"> {Number(files.length)}</p>
//                                 <p className="text-muted-foreground capitalize">Showcases</p>
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold"> {Number(user?.followers?.length)}</p>
//                                 <p className="text-muted-foreground capitalize">Followers</p>
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold">{Number(user?.followings?.length)}</p>
//                                 <p className="text-muted-foreground capitalize">Following</p>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     )
// }

// export default UpdateUserProfile