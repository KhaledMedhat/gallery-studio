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
import "react-advanced-cropper/dist/themes/compact.css";
const CustomCropper: React.FC<{ showcase: string; isCircle: boolean }> = ({
  showcase,
  isCircle,
}) => {
  const { setShowcaseUrl } = useFileStore();
  const cropperRef = useRef<CropperRef>(null);
  const { setCroppedImage } = useFileStore();
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
    <div className="relative h-[300px] w-full">
      <div className="absolute right-0 top-0 z-10">
        <Button
          type="button"
          className="py-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => setShowcaseUrl({ url: "", type: "" })}
        >
          <X size={30} />
        </Button>
      </div>
      <div className="absolute left-4 top-[50%] z-10 flex translate-y-[-50%] flex-col items-center">
        <Button
          type="button"
          className="py-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => flip(true, false)}
        >
          <FlipHorizontal size={30} />
        </Button>
        <Button
          type="button"
          className="py-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => flip(false, true)}
        >
          <FlipVertical size={30} />
        </Button>
        <Button
          type="button"
          className="py-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => rotate(90)}
        >
          <RotateCw size={30} />
        </Button>
        <Button
          type="button"
          className="py-0 hover:bg-transparent"
          variant="ghost"
          onClick={() => rotate(-90)}
        >
          <RotateCcw size={30} />
        </Button>
      </div>
      {/* <div className="absolute z-10 bottom-0 left-[50%] translate-x-[-50%]">
        <Button>asdasdasdasd</Button>
      </div> */}
      <Cropper
        ref={cropperRef}
        stencilComponent={isCircle ? CircleStencil : undefined}
        style={{ width: "100%", height: "100%", transition: "all 0.3s ease" }}
        src={showcase}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomCropper;
