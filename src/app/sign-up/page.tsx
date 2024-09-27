import SignUp from "../_components/SignUp";
import { getProvidedUserAccountGallery } from "../actions";

export default async function SignUpPage() {
  await getProvidedUserAccountGallery();
  return <SignUp />;
}
