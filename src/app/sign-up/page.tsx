import { Suspense } from "react";
import SignUp from "../_components/SignUp";
import { getProvidedUserAccountGallery } from "../actions";

export default async function SignUpPage() {
  await getProvidedUserAccountGallery();
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <SignUp />;
    </Suspense>)
}
