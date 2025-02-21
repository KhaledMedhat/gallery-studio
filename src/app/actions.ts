"use server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema";

export const deleteCookie = async () => {
  const cookie = cookies().get("sessionToken");
  if (cookie) {
    await db.delete(sessions).where(eq(sessions.sessionToken, cookie.value));
    cookies().delete("sessionToken");
  }
};

const utapi = new UTApi();
export const deleteFileOnServer = async (fileKey: string | string[]) => {
  await utapi.deleteFiles(fileKey);
};
