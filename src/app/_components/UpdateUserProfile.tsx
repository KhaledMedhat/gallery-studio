import { Button } from "~/components/ui/button";
import { useFileStore, useUserStore } from "~/store";
import Image from "next/legacy/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Camera, Check, ImageIcon, LoaderCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import UploadthingButton from "./UploadthingButton";
import { useState } from "react";
import { blobUrlToFile, getInitials } from "~/utils/utils";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { useUploader } from "~/hooks/useUploader";
import { type UserImage } from "~/types/types";

export const UpdateUserCoverImage: React.FC<{ coverImage: UserImage }> = ({
  coverImage,
}) => {
  const { isUploading, setFileUrl, setFileKey } = useFileStore();
  const { setIsUserUpdating } = useUserStore();
  const router = useRouter();
  const {
    mutate: UpdateUserCoverImage,
    isPending: isUpdatingUserCoverImagePending,
  } = api.user.updateUserProfile.useMutation({
    onSuccess: () => {
      setShowcaseUrl({ url: "", type: "" });
      setFileUrl("");
      setFileKey("");
      setIsUserUpdating(false);
      toast({
        title: "Updated Successfully.",
        description: `Your profile cover image has been updated successfully.`,
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: `Uh oh! Something went wrong. Please try again.`,
      });
    },
  });
  const { startUpload, getDropzoneProps } = useUploader(
    true,
    coverImage.imageKey,
    undefined,
    UpdateUserCoverImage,
    undefined,
  );

  const { showcaseUrl, croppedImage, showcaseOriginalName, setShowcaseUrl } =
    useFileStore();
  const getCroppedImage = async () => {
    if (showcaseUrl && croppedImage) {
      const croppedImageFile = await blobUrlToFile(
        croppedImage,
        showcaseOriginalName,
      );
      await startUpload([croppedImageFile]);
    }
  };

  const handleUpdateCoverImage = async () => {
    await getCroppedImage();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button asChild className="h-full w-full cursor-pointer p-0">
          <div className="h-full w-full">
            <Image
              src={coverImage.imageUrl}
              alt="Cover Image"
              objectFit="contain"
              layout="fill"
            />
            <div className="z-10 flex h-full w-full items-center justify-center bg-background/60">
              <Plus className="!h-[50px] !w-[50px]" />
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit max-h-full max-w-2xl overflow-y-auto xl:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upload Cover Image</DialogTitle>
          <DialogDescription>
            Make changes to your profile cover image here.
          </DialogDescription>
        </DialogHeader>
        <UploadthingButton
          label={"Cover Image"}
          isImageComponent={true}
          isProfile={true}
          getDropzoneProps={getDropzoneProps}
          isCircle={false}
        />
        <DialogFooter>
          <Button
            disabled={isUpdatingUserCoverImagePending || isUploading}
            onClick={handleUpdateCoverImage}
          >
            {isUpdatingUserCoverImagePending || isUploading ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const UpdateUserInfo: React.FC<{
  image: UserImage | undefined | null;
  name: string | undefined | null;
  bio: string | undefined | null;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
}> = ({ image, name, bio, firstName, lastName }) => {
  const [updatedBio, setUpdatedBio] = useState<string | undefined | null>(bio);
  const {
    isUploading,
    setFileUrl,
    setFileKey,
    croppedImage,
    showcaseUrl,
    showcaseOriginalName,
  } = useFileStore();
  const { setIsUserUpdating } = useUserStore();

  const router = useRouter();
  const {
    mutate: UpdateUserProfile,
    isPending: isUpdatingUserCoverImagePending,
  } = api.user.updateUserProfile.useMutation({
    onSuccess: () => {
      setFileUrl("");
      setFileKey("");
      setIsUserUpdating(false);
      toast({
        title: "Updated Successfully.",
        description: `Your profile has been updated successfully.`,
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: `Uh oh! Something went wrong. Please try again.`,
      });
    },
  });

  const handleBioChange = () => {
    if (updatedBio) {
      UpdateUserProfile({
        bio: updatedBio,
      });
    }
  };
  const { startUpload, getDropzoneProps } = useUploader(
    true,
    image?.imageKey,
    undefined,
    undefined,
    UpdateUserProfile,
  );
  const getCroppedImage = async () => {
    if (showcaseUrl && croppedImage) {
      const croppedImageFile = await blobUrlToFile(
        croppedImage,
        showcaseOriginalName,
      );
      await startUpload([croppedImageFile]);
    }
  };
  const handleUpdateProfile = async () => {
    await getCroppedImage();
  };
  return (
    <div className="mt-12 flex flex-col items-center gap-6 md:mt-0 md:flex-row md:items-start">
      <Avatar className="absolute left-1/2 top-0 flex h-[10rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-4 border-background md:left-8 md:translate-x-0">
        <AvatarImage
          src={image?.imageUrl ?? ""}
          alt={name ?? ""}
          className="h-full w-full rounded-full object-cover"
        />
        <div className="absolute z-10 flex h-full w-full cursor-pointer items-center justify-center bg-background/60">
          <Dialog>
            <DialogTrigger asChild>
              <Plus className="!h-[50px] !w-[50px]" />
            </DialogTrigger>
            <DialogContent className="w-fit">
              <DialogHeader>
                <DialogTitle>Upload Profile Image</DialogTitle>
                <DialogDescription>
                  Make changes to your profile image here.
                </DialogDescription>
              </DialogHeader>

              <UploadthingButton
                label={"Profile Image"}
                getDropzoneProps={getDropzoneProps}
                isImageComponent={true}
                isProfile={true}
                isCircle={true}
              />
              <DialogFooter>
                <Button
                  disabled={isUpdatingUserCoverImagePending || isUploading}
                  onClick={handleUpdateProfile}
                >
                  {isUpdatingUserCoverImagePending || isUploading ? (
                    <LoaderCircle size={20} className="animate-spin" />
                  ) : (
                    "  Save changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-slate-500 text-3xl font-bold">
          {getInitials(firstName ?? "", lastName ?? "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-center md:ml-40 md:text-left">
        <h1 className="text-2xl font-bold">
          {firstName} {lastName}
        </h1>
        <p className="text-muted-foreground">@{name}</p>
        <div className="mt-2 flex w-full items-center gap-4">
          <Input
            placeholder="About you"
            value={updatedBio!}
            onChange={(e) => setUpdatedBio(e.target.value)}
          />
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={handleBioChange}
          >
            <Check size={20} />
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
          <Badge variant="secondary">
            <Camera className="mr-1 h-4 w-4" />
            Photographer
          </Badge>
          <Badge variant="secondary">
            <ImageIcon className="mr-1 h-4 w-4" />
            Digital Artist
          </Badge>
        </div>
      </div>
      <Button
        onClick={() => setIsUserUpdating(false)}
        className="md:self-start"
      >
        Cancel
      </Button>
    </div>
  );
};
