"use server";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema";
import { api } from "~/trpc/server";

export const deleteCookie = async() => {
  const cookie = cookies().get("sessionToken");
  if (cookie) {
    await db.delete(sessions).where(eq(sessions.sessionToken, cookie.value))
    cookies().delete("sessionToken");
  }
};

const utapi = new UTApi();
export const deleteFileOnServer = async (fileKey: string | string[]) => {
  await utapi.deleteFiles(fileKey);
};

export const getProvidedUserAccountGallery = async () => {
  try {
    const providedUserAccount = await api.user.getProvidedUserRoute();
    if (providedUserAccount) {
      const providedUserAccountGallery =
        await api.gallery.getProvidedUserAccountGallery({
          id: providedUserAccount.userId,
        });
      if (providedUserAccountGallery?.slug) {
        return redirect(`/galleries/${providedUserAccountGallery.slug}`);
      }
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
  }
};
