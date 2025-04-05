'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Facebook, Instagram, LoaderCircle, Trash2, Twitter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { toast } from "~/hooks/use-toast"
import { api } from "~/trpc/react"
import { ElementType, MentionType, type User } from "~/types/types"
import { Label } from "~/components/ui/label"
import * as React from "react"
import MentionInput from "./MentionInput"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import UploadthingButton from "./UploadthingButton"
import { useUploader } from "~/hooks/useUploader"
import { getInitials, prepareFileForUpload } from "~/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import Image from "next/image"
import { useFileStore } from "~/store"

enum SettingTabs {
    Profile,
    Account,
    // Notifications,
}
const UserSettings: React.FC<{ currentUser: User | undefined | null }> = ({ currentUser }) => {
    const [isPPDialogOpen, setIsPPDialogOpen] = useState<boolean>(false);
    const [isPCDialogOpen, setIsPCDialogOpen] = useState<boolean>(false);
    const { croppedImage, isUploading, showcaseOriginalName, isUploadedShowcaseEditing, showcaseUrl } = useFileStore()
    const tabs = [
        { label: "Profile", value: SettingTabs.Profile },
        { label: "Account", value: SettingTabs.Account },
        // { label: "Notifications", value: SettingTabs.Notifications },
    ]
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<SettingTabs>(SettingTabs.Profile)
    const [mentionInputValue, setMentionInputValue] = useState<string>(currentUser?.bio ?? "")
    const formSchema = z.object({
        username: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        dateOfBirth: z.string().optional(),
        urls: z.array(z.object({
            platformIcon: z.string(),
            url: z.string().url(),
            isNew: z.boolean().optional(),
        })).optional(),
        profilePicture: z.object({ url: z.string(), type: z.string() }).optional(),
        coverImage: z.object({ url: z.string(), type: z.string() }).optional(),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: currentUser?.name,
            urls: currentUser?.socialUrls ?? [{ url: "", platformIcon: "", isNew: false }],
        },
    });



    const { fields, append, remove } = useFieldArray({
        name: "urls",
        control: form.control,
    })
    const { mutate: updateUserSettings, isPending: isUpdatingUserSettingsPending } = api.user.updateUserProfile.useMutation({
        onSuccess: () => {
            router.refresh();
            setIsPPDialogOpen(false)
            setIsPCDialogOpen(false)
            toast({
                title: "Updated Successfully.",
                description: `Your profile has been updated successfully.`,
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Uh oh! Something went wrong. Please try again.`,
            });
        },
    });
    const { startUpload: startUploadProfilePicture, getDropzoneProps: getDropzonePropsProfilePicture } = useUploader(
        undefined,
        currentUser?.profileImage?.imageKey,
        undefined,
        updateUserSettings,
        undefined,
        undefined,
    );
    const { startUpload: startUploadCoverImage, getDropzoneProps: getDropzonePropsCoverImage } = useUploader(
        undefined,
        currentUser?.coverImage?.imageKey,
        undefined,
        undefined,
        updateUserSettings,
        undefined,
    );


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        updateUserSettings({
            username: data.username,
            bio: mentionInputValue,
            socialUrls: data.urls,
        })

    };
    const onUpdateProfilePicture = async () => {
        await prepareFileForUpload(showcaseUrl, croppedImage, showcaseOriginalName, isUploadedShowcaseEditing, startUploadProfilePicture);
    };
    const onUpdateImageCover = async () => {
        await prepareFileForUpload(showcaseUrl, croppedImage, showcaseOriginalName, isUploadedShowcaseEditing, startUploadCoverImage);
    };

    const renderTabHeader = () => {
        return (
            <div className="flex flex-col items-start">
                <h2 className="text-xl font-bold">
                    {activeTab === SettingTabs.Profile && "Profile"}
                    {activeTab === SettingTabs.Account && "Account"}
                    {/* {activeTab === SettingTabs.Notifications && "Notifications"} */}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {activeTab === SettingTabs.Profile && "This is how others will see you on the site."}
                    {activeTab === SettingTabs.Account && "Update your account settings. Set your preferred language and timezone."}
                    {/* {activeTab === SettingTabs.Notifications && "Configure how you receive notifications."} */}

                </p>
            </div>
        )
    }

    const socialMediaOptions = [
        { value: "Facebook", label: "Facebook", icon: Facebook },
        { value: "Twitter", label: "Twitter", icon: Twitter },
        { value: "Instagram", label: "Instagram", icon: Instagram },
    ]
    const renderTabContent = () => {
        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="h-fit space-y-8 "
                >
                    <div className="flex flex-col gap-6">
                        {activeTab === SettingTabs.Profile && <>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isUpdatingUserSettingsPending}
                                                placeholder="Username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="bio">Bio</Label>
                                    <MentionInput isUpdatingUserSettingsPending={isUpdatingUserSettingsPending} currentUser={currentUser} mentionType={MentionType.FOLLOWINGS} inputType={ElementType.TEXTAREA} mentionInputValue={mentionInputValue} setMentionInputValue={setMentionInputValue} />
                                </div>
                                <p className="text-sm text-muted-foreground">You can @mention other users and organizations to link to them.</p>

                            </div>

                            <FormField
                                control={form.control}
                                name="urls"
                                render={() => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>URLs</FormLabel>
                                        <FormDescription>Add links to your website, blog, or social media profiles.</FormDescription>
                                        <div className="space-y-4">
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`urls.${index}.platformIcon`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-grow-0">
                                                                <FormLabel className="sr-only">Social Media Platform</FormLabel>
                                                                <Select disabled={isUpdatingUserSettingsPending} onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-[130px]">
                                                                            <SelectValue placeholder="Select platform" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {socialMediaOptions.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value}>
                                                                                <div className="flex gap-1 items-center">
                                                                                    <option.icon className="h-4 w-4" />
                                                                                    {option.label}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`urls.${index}.url`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-grow md:relative">
                                                                <FormLabel className="sr-only">URL</FormLabel>
                                                                <FormControl>
                                                                    <Input disabled={isUpdatingUserSettingsPending} placeholder="https://example.com" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="mt-2"
                                                        disabled={isUpdatingUserSettingsPending}
                                                        onClick={() => {

                                                            const urls = form.getValues('urls')
                                                            const currentUrl = urls?.[index]?.url ?? ""
                                                            if (currentUser?.socialUrls?.[index]?.url.includes(currentUrl)) {
                                                                const existedUrls = urls?.map(({ isNew, ...rest }) => rest);
                                                                const updatedUrls = existedUrls?.filter((url) => url.url !== currentUrl);
                                                                updateUserSettings({
                                                                    socialUrls: updatedUrls,
                                                                });
                                                                remove(index)
                                                            } else {
                                                                remove(index)
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-fit text-xs"
                                                disabled={isUpdatingUserSettingsPending}
                                                onClick={() => append({ platformIcon: "", url: "", isNew: true })}
                                            >
                                                Add URL
                                            </Button>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </>}
                        {activeTab === SettingTabs.Account &&
                            <>
                                <div className="flex flex-col items-start gap-2">
                                    <p className="text-sm">Profile Picture</p>
                                    <Avatar className="h-52 w-52 transform items-center justify-center rounded-full border-4 border-background">
                                        <AvatarImage
                                            src={currentUser?.profileImage?.imageUrl ?? ""}
                                            alt={currentUser?.name}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-slate-500 text-3xl font-bold">
                                            {getInitials(currentUser?.firstName ?? "", currentUser?.lastName ?? "")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Dialog open={isPPDialogOpen} onOpenChange={setIsPPDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="justify-start w-fit">
                                                Change
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="h-fit max-h-full overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Profile Picture</DialogTitle>
                                                <DialogDescription>
                                                    Upload a new profile picture to your account.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <UploadthingButton
                                                label={"Profile Picture"}
                                                getDropzoneProps={getDropzonePropsProfilePicture}
                                                isImageComponent={true}
                                                isProfile={true}
                                                isCircle={true}
                                            />
                                            <DialogFooter>
                                                <Button type="button" onClick={onUpdateProfilePicture} disabled={isUpdatingUserSettingsPending || isUploading}>
                                                    {isUpdatingUserSettingsPending && <LoaderCircle size={20} className="animate-spin" />}
                                                    {isUpdatingUserSettingsPending || isUploading ? (
                                                        <div className="flex items-center justify-center gap-1">
                                                            <LoaderCircle size={20} className="animate-spin" />
                                                            {isUploading && "Uploading ..."}
                                                            {isUpdatingUserSettingsPending && "Updating your profile picture ..."}
                                                        </div>
                                                    ) : (
                                                        "Update"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <p className="text-sm text-muted-foreground">This is your public display Profile Picture</p>
                                </div>
                                <div className="flex flex-col items-start gap-2">
                                    <p className="text-sm">Cover Image</p>
                                    <div className="relative h-64 w-full">
                                        <Image
                                            src={currentUser?.coverImage?.imageUrl ?? "/image-3@2x.jpg"}
                                            alt={`${currentUser?.name}'s cover image`}
                                            fill
                                            style={{ objectFit: "cover" }} />
                                    </div>
                                    <Dialog open={isPCDialogOpen} onOpenChange={setIsPCDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="justify-start w-fit">
                                                Change
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="h-fit max-h-full overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Cover Image</DialogTitle>
                                                <DialogDescription>
                                                    Upload a new Cover Image to your account.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <UploadthingButton
                                                label={"Cover Image"}
                                                getDropzoneProps={getDropzonePropsCoverImage}
                                                isImageComponent={true}
                                                isProfile={true}
                                                isCircle={false}
                                            />
                                            <DialogFooter>
                                                <Button type="button" onClick={onUpdateImageCover} disabled={isUpdatingUserSettingsPending || isUploading}>
                                                    {isUpdatingUserSettingsPending && <LoaderCircle size={20} className="animate-spin" />}
                                                    {isUpdatingUserSettingsPending || isUploading ? (
                                                        <div className="flex items-center justify-center gap-1">
                                                            <LoaderCircle size={20} className="animate-spin" />
                                                            {isUploading && "Uploading ..."}
                                                            {isUpdatingUserSettingsPending && "Updating your cover image ..."}
                                                        </div>
                                                    ) : (
                                                        "Update"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <p className="text-sm text-muted-foreground">This is your public display Cover Image</p>
                                </div>
                            </>
                        }
                    </div>
                    {activeTab === SettingTabs.Account ? null : <Button type="submit" disabled={isUpdatingUserSettingsPending}>
                        {isUpdatingUserSettingsPending && <LoaderCircle size={20} className="animate-spin" />}
                        {activeTab === SettingTabs.Profile && "Update Profile"}
                        {/* {activeTab === SettingTabs.Notifications && "Update Notifications"} */}

                    </Button>}
                </form>
            </Form >
        )
    }
    return (
        <section className="container mx-auto flex flex-col gap-4 m-6">
            <div className="self-start">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-center text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Separator />
            <div className="flex w-full flex-col md:flex-row items-center md:items-start gap-4">
                <div className="flex flex-row md:flex-col items-start w-full md:w-1/4">
                    {tabs.map((tab) => (
                        <Button className="w-full p-0 justify-center md:justify-start hover:bg-transparent" variant={tab.value === activeTab ? "ghost" : "link"} key={tab.value} onClick={() => setActiveTab(tab.value)}>
                            {tab.label}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-col gap-6 w-full md:w-1/2">
                    {renderTabHeader()}
                    <Separator />
                    {renderTabContent()}
                </div>
            </div>

        </section>
    )
}
export default UserSettings