import { useDropzone } from "@uploadthing/react";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";
import { useImageStore } from "~/store";
import { useUploadThing } from "~/utils/uploadthing";

const UploadthingButton: React.FC<{ isImageComponent?: boolean }> = ({
  isImageComponent,
}) => {
  const { setIsUploading, setProgress, setImageUrl, setImageKey } =
    useImageStore();
  const { toast } = useToast();
  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setImageUrl(res[0]?.url ?? "");
      setImageKey(res[0]?.key ?? "");
    },
    onUploadProgress: (progress) => {
      setIsUploading(true);
      setProgress(progress);
    },
    onUploadError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles).catch((e) => {
        console.log(e);
      });
    },
    [startUpload],
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
        Profile Image
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
          <p className={`${!isImageComponent && "text-gray-100"} text-xs`}>
            PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <Input
          {...getInputProps()}
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadthingButton;
