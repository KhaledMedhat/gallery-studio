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
    <Suspense  fallback={<div className="text-white">Loading...</div>}>
      <SignIn />
    </Suspense>
  );
}
