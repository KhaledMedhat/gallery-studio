import { useDropzone } from "@uploadthing/react";
import { Upload } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useFileStore } from "~/store";
import CustomCropper from "./Cropper";
import { typeOfFile } from "~/utils/utils";
import Video from "./Video";

const UploadthingButton: React.FC<{
  isImageComponent?: boolean;
  label: string;
  isProfile: boolean;
  isFileError?: boolean;
  getDropzoneProps: () => {
    onDrop: (acceptedFiles: File[]) => void;
    accept: Record<string, never[]>;
  };
  isCircle: boolean;
}> = ({
  isImageComponent,
  getDropzoneProps,
  label,
  isFileError,
  isProfile,
  isCircle,
}) => {
  const { setShowcaseUrl, showcaseUrl, setShowcaseOriginalName } =
    useFileStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setShowcaseOriginalName(file.name);
      const imageUrl = URL.createObjectURL(file);
      setShowcaseUrl({
        url: imageUrl,
        type: file.type,
      });
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...getDropzoneProps(),
  });

  return showcaseUrl.url ? (
    typeOfFile(showcaseUrl.type) === "Image" ? (
      <CustomCropper showcase={showcaseUrl.url} isCircle={isCircle} />
    ) : (
      <Video url={showcaseUrl.url} />
    )
  ) : (
    <div className="space-y-4">
      <Label
        htmlFor="profileImage"
        className={`${!isImageComponent && "text-gray-100"} text-sm font-medium`}
      >
        <p className={`${isFileError && "text-[#EF4444]"}`}>
          {label} {label === "Image" && "*"}
        </p>
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
          <p
            className={`${!isImageComponent && "text-gray-100"} w-3/4 text-center text-xs`}
          >
            {isProfile
              ? " Images type allowed are .png, .jpg, .jpeg (MAX. 32MB|Image)"
              : " Image, Video or GIF (MAX. 32MB|Image/GIF) (MAX. 256MB|Video)"}
          </p>
        </div>
        <Input
          {...getInputProps()}
          onChange={handleImageUpload}
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
