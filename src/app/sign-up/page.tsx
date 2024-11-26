import { Suspense } from "react";
import SignUp from "../_components/SignUp";
import { getProvidedUserAccountGallery } from "../actions";
import { Dot } from "lucide-react";

export default async function SignUpPage() {
  await getProvidedUserAccountGallery();
  return (
    <Suspense fallback={<div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <Dot size={250} className="animate-bounce" />
    </div>}>
      <main className="h-screen overflow-hidden">
        <SignUp />;
      </main>
    </Suspense>)
}
