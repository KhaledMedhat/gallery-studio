import { TRPCError } from "@trpc/server";
import GalleryStudioVerifyOTPEmail from "emails/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function Send(userName: string, OTPCode: string, email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Gallery-Studio OTP",
      react: GalleryStudioVerifyOTPEmail({ userName, OTPCode }),
    });
    console.log(data);
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send email",
        cause: error,
      });
    }

    return data;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      cause: error,
    });
  }
}
