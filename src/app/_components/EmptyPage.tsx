import { Redo } from "lucide-react";

const EmptyPage = () => {
  return (
      <div className="flex h-full w-full flex-col items-center gap-10">
        <p>You have no images or videos Hurry up and add your first one</p>
        <Redo size={500} className="rotate-45" />
      </div>
  );
};

export default EmptyPage;
