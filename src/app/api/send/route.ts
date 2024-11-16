import GalleryStudioVerifyOTPEmail from "emails/EmailTemplate";
import ResetPasswordEmailTemplate from "emails/ResetPasswordEmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function Send(userName: string, OTPCode: string, email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Gallery-Studio <noreply@confirmail.online>",
      to: email,
      subject: "Gallery-Studio OTP",
      react: GalleryStudioVerifyOTPEmail({ userName, OTPCode }),
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function SendResetPasswordLink(
  userName: string,
  id: string,
  email: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Gallery-Studio <noreply@confirmail.online>",
      to: email,
      subject: "Gallery-Studio Reset Password",
      react: ResetPasswordEmailTemplate({ id, userName }),
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
