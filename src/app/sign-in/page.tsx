import SignIn from "../_components/SignIn";
import { getProvidedUserAccountGallery } from "../actions";

export default async function SignInPage() {
  await getProvidedUserAccountGallery();
  return <SignIn />;
}
