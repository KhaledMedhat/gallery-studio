import { Button } from "~/components/ui/button";
import {
  type CropperRef,
  CircleStencil,
  Cropper,
  debounce,
} from "react-advanced-cropper";
import { useRef } from "react";
import { useFileStore } from "~/store";
import {
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  X,
} from "lucide-react";
import "react-advanced-cropper/dist/style.css";
import "react-advanced-cropper/dist/themes/classic.css";
import type { FieldValues, UseFormReturn } from "react-hook-form";
const CustomCropper: React.FC<{
  showcase: string;
  isCircle: boolean;
  form?: UseFormReturn<FieldValues, FieldValues>;
}> = ({ showcase, isCircle, form }) => {
  const cropperRef = useRef<CropperRef>(null);
  const { setCroppedImage, setShowcaseUrl } = useFileStore();

  const onChange = debounce((cropper: CropperRef) => {
    cropper
      .getCanvas()
      ?.toBlob((res) => res && setCroppedImage(URL.createObjectURL(res)));
  }, 100);

  const flip = (horizontal: boolean, vertical: boolean) => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(horizontal, vertical);
    }
  };

  const rotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  return (
    <div className="relative flex h-fit min-w-40 max-w-full flex-col items-center gap-4">
      <div className="h-full w-full">
        <div className="absolute right-0 top-0 z-10">
          <Button
            type="button"
            className="py-0 hover:bg-transparent"
            variant="ghost"
            onClick={async () => {
              form?.unregister("showcaseFile");
              await form?.trigger("showcaseFile");
              setShowcaseUrl({ url: "", type: "" });
            }}
          >
            <X size={30} color="white" />
          </Button>
        </div>

        <Cropper
          ref={cropperRef}
          stencilComponent={isCircle ? CircleStencil : undefined}
          src={showcase}
          onChange={onChange}
          boundaryClassName="max-h-[300px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" onClick={() => flip(true, false)}>
          <FlipHorizontal size={30} />
        </Button>
        <Button type="button" onClick={() => flip(false, true)}>
          <FlipVertical size={30} />
        </Button>
        <Button type="button" onClick={() => rotate(90)}>
          <RotateCw size={30} />
        </Button>
        <Button type="button" onClick={() => rotate(-90)}>
          <RotateCcw size={30} />
        </Button>
      </div>
    </div>
  );
};

export default CustomCropper;
