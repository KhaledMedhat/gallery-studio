/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone } from "@uploadthing/react";
import { Upload } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useFileStore } from "~/store";
import CustomCropper from "./Cropper";
import { typeOfFile } from "~/utils/utils";
import Video from "./Video";
import { toast } from "~/hooks/use-toast";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";

const UploadthingButton: React.FC<{
  isImageComponent?: boolean;
  label?: string;
  isProfile: boolean;
  field?: ControllerRenderProps<any, "showcaseFile">;
  form?: UseFormReturn<any, any>;
  getDropzoneProps: () => {
    onDrop: (acceptedFiles: File[]) => void;
    accept: Record<string, never[]>;
  };
  isCircle: boolean;
}> = ({
  isImageComponent,
  getDropzoneProps,
  field,
  label,
  form,
  isProfile,
  isCircle,
}) => {
  const { setShowcaseOriginalName, setShowcaseUrl, showcaseUrl } =
    useFileStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 1) {
      toast({
        title: "You can only upload one file at a time.",
        description: "Please select a single file.",
      });
      return;
    }
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setShowcaseOriginalName(file.name);
      const imageUrl = URL.createObjectURL(file);
      if (form) {
        form.setValue("showcaseFile", {
          url: imageUrl,
          type: file?.type ?? "",
        });
        form.clearErrors("showcaseFile");
      } else {
        setShowcaseUrl({
          url: imageUrl,
          type: file?.type ?? "",
        });
      }
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...getDropzoneProps(),
  });
  const formShowcaseUrl: { url: string; type: string } =
    form?.watch("showcaseFile");

  return (formShowcaseUrl?.url ?? showcaseUrl.url) ? (
    typeOfFile(formShowcaseUrl?.type ?? showcaseUrl.type) === "Image" ? (
      <CustomCropper
        form={form}
        showcase={formShowcaseUrl?.url ?? showcaseUrl.url}
        isCircle={isCircle}
      />
    ) : (
      <Video url={formShowcaseUrl?.url ?? showcaseUrl.url} />
    )
  ) : (
    <div className="space-y-4">
      <Label
        htmlFor="profileImage"
        className={`${!isImageComponent && "text-gray-100"} text-sm font-medium`}
      >
        <p>{label === "Image" && "*"}</p>
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
          onBlur={field?.onBlur}
          name={field?.name}
          ref={field?.ref}
          onChange={handleImageUpload}
          id="profileImage"
          type="file"
          accept={isProfile ? ".png, .jpg, .jpeg" : "image/*, video/*"}
          className="hidden"
          {...getInputProps()}
        />
      </div>
    </div>
  );
};

export default UploadthingButton;
