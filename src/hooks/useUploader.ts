import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "~/hooks/use-toast";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { useFileStore } from "~/store";
import { useCallback, useState } from "react";
import { type UploadThingError } from "uploadthing/server";
import { deleteFileOnServer } from "~/app/actions";
import type { AddShowcaseType } from "~/types/types";

export const useUploader = (
  isCropping: boolean,
  imageKey?: string,
  addShowcase?: (data: AddShowcaseType) => void,
  UpdateUserCoverImage?: (data: {
    coverImage: { imageUrl: string; imageKey: string };
  }) => void,
  UpdateUserProfile?: (data: {
    image: { imageUrl: string; imageKey: string };
  }) => void,
) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const {
    setIsUploading,
    setProgress,
    setFileUrl,
    setFileKey,
    setFileType,
    setShowcaseUrl,
    setShowcaseOriginalName,
    formData,
  } = useFileStore();
  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res[0]) {
        if (imageKey) {
          await deleteFileOnServer(imageKey);
        }
        setIsUploading(false);
        setFileUrl(res[0]?.url);
        setFileKey(res[0]?.key);
        setFileType(res[0]?.type);
        if (UpdateUserCoverImage) {
          UpdateUserCoverImage({
            coverImage: {
              imageUrl: res[0]?.url,
              imageKey: res[0]?.key,
            },
          });
        }
        if (UpdateUserProfile) {
          UpdateUserProfile({
            image: {
              imageUrl: res[0]?.url,
              imageKey: res[0]?.key,
            },
          });
        }

        if (addShowcase && formData) {
          addShowcase({
            url: res[0]?.url,
            fileKey: res[0]?.key,
            fileType: res[0]?.type,
            filePrivacy: formData?.filePrivacy ? "public" : "private",
            caption: formData?.caption,
            tags: formData?.tags ?? [],
            gallerySlug: formData?.gallerySlug,
          });
        }
      }
    },
    onUploadProgress: (progress) => {
      setIsUploading(true);
      setProgress(progress);
    },
    onUploadError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          e.code === "BAD_REQUEST"
            ? "You can't upload more than 1 file at a time"
            : e.message,
      });
      setIsUploading(false);
    },
  });
  const onDropForCrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        setShowcaseOriginalName(acceptedFiles[0].name);
        setShowcaseUrl({
          url: URL.createObjectURL(acceptedFiles[0]),
          type: acceptedFiles[0].type,
        });
      }
    },
    [setShowcaseOriginalName, setShowcaseUrl],
  );
  const onDropForUpload = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles).catch((e: UploadThingError) => {
        return e;
      });
      setFile(acceptedFiles[0]);
    },
    [setFile, startUpload],
  );
  const getDropzoneProps = () => ({
    onDrop: isCropping ? onDropForCrop : onDropForUpload,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return {
    file,
    startUpload,
    getDropzoneProps,
  };
};
