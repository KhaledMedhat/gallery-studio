import { Resend } from "resend";
import { EmailTemplate } from "~/app/_components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function Send(userName: string, otp: string, email:string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Gallery-Studio OTP",
      react: EmailTemplate({ userName, otp }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
