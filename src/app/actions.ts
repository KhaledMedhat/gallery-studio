"use server";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";

export const deleteCookie = () => {
  const cookie = cookies().get("sessionToken");
  if (cookie) {
    cookies().delete("sessionToken");
  }
};


const utapi = new UTApi();
export const deleteFileOnServer = async (fileKey: string | string[]) => {
    await utapi.deleteFiles(fileKey);
  };