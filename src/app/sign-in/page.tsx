import { Dot } from "lucide-react";
import SignIn from "../_components/SignIn";
import { getProvidedUserAccountGallery } from "../actions";
import { Suspense } from "react";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await getProvidedUserAccountGallery();
  return (
    <Suspense fallback={<div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <Dot size={250} className="animate-bounce" />
    </div>}>
      <main>
        <SignIn />
      </main>
    </Suspense>
  );
}
