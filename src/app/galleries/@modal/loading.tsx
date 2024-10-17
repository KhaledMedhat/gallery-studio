import { Dot } from "lucide-react";

export default async function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <Dot size={250} color="white" className="animate-bounce" />
    </div>
  );
}
