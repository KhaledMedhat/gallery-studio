"use server";
import { cookies } from "next/headers";

export const deleteCookie = () => {
  const cookie = cookies().get("sessionToken");
  if (cookie) {
    cookies().delete("sessionToken");
  }
};
