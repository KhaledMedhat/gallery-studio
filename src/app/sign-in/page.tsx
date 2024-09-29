import SignIn from "../_components/SignIn";
import { getProvidedUserAccountGallery } from "../actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await getProvidedUserAccountGallery();
  return <SignIn paramError={searchParams.error} />;
}
