import { useDropzone } from "@uploadthing/react";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { type UploadThingError } from "uploadthing/server";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { useFileStore } from "~/store";
import { useUploadThing } from "~/utils/uploadthing";

const UploadthingButton: React.FC<{
  isImageComponent?: boolean;
  setFile: (args: File | undefined) => void;
  label: string;
  isProfile: boolean;
  isFileError?: boolean;
}> = ({ isImageComponent, setFile, label, isFileError, isProfile }) => {
  const { setIsUploading, setProgress, setFileUrl, setFileKey, setFileType } =
    useFileStore();
  const { toast } = useToast();
  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res[0]) {
        setIsUploading(false);
        setFileUrl(res[0]?.url);
        setFileKey(res[0]?.key);
        setFileType(res[0]?.type);
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles).catch((e: UploadThingError) => {
        return e
      });
      setFile(acceptedFiles[0]);
    },
    [setFile, startUpload],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });
  return (
    <div className="space-y-4">
      <Label
        htmlFor="profileImage"
        className={`${!isImageComponent && "text-gray-100"} text-sm font-medium`}
      >
        <p className={`${isFileError && "text-[#EF4444]"}`}>{label} {label === 'Image' && '*'}</p>
      </Label>
      <div className="flex w-full items-center justify-center">
        <div
          {...getRootProps()}
          className={`bg-transparent ${isDragActive && "border-2 border-dashed border-white"} flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700`}
        >
          <Upload
            className={`${!isImageComponent && "text-gray-100"} mb-3 h-10 w-10`}
          />
          <p className={`${!isImageComponent && "text-gray-100"} mb-2 text-sm`}>
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className={`${!isImageComponent && "text-gray-100"} text-xs text-center w-3/4`}>
            {isProfile ? ' Images type allowed are .png, .jpg, .jpeg (MAX. 32MB|Image)' : ' Image, Video or GIF (MAX. 32MB|Image/GIF) (MAX. 256MB|Video)'}

          </p>
        </div>
        <Input
          {...getInputProps()}
          id="profileImage"
          name="profileImage"
          type="file"
          accept={isProfile ? ".png, .jpg, .jpeg" : "image/*, video/*"}
          className="hidden"
        />
      </div>
      {isFileError && (
        <p className="text-sm font-semibold text-[#EF4444]">
          File is required.
        </p>
      )}
    </div>
  );
};

export default UploadthingButton;
