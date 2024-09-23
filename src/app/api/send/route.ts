import GalleryStudioVerifyOTPEmail from "emails/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function Send(userName: string, OTPCode: string, email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Gallery-Studio <onboarding@resend.dev>",
      to: email,
      subject: "Gallery-Studio OTP",
      react: GalleryStudioVerifyOTPEmail({ userName, OTPCode }),
    });
    console.log(data);
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
