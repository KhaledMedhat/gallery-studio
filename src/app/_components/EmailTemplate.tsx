// import Image from "next/image";
// import Link from "next/link";
// import { Separator } from "~/components/ui/separator";

interface EmailTemplateProps {
  userName: string;
  otp: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  otp,
}) => {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center gap-6 m-auto">
      <h1 className="text-2xl font-bold">Your OTP</h1>
      <p className="text-center">
        <span className="text-lg font-bold"> Hey {userName},</span>
        <br />
        <br />
        Thank you for choosing <span className="font-bold">
          GALLERY-STUDIO
        </span>{" "}
        . Use the following OTP to complete the procedure to create your
        account. OTP is valid for 5 minutes. Do not share this code with others.
      </p>
      <div>
        <h2 className="text-4xl text-[#e21d48] font-bold tracking-[1em]">
          {otp.split("").join("")}
        </h2>
      </div>

      <p>
        If you need any assistance, please visit our
        {/* <Link className="text-[#e21d48] font-bold hover:underline" href={"./help"}> Help Center</Link>. */}
      </p>
      {/* <Separator /> */}
      <div className="flex flex-col items-center justify-center gap-4">
        {/* <Image src="./logo-black.svg" alt="logo" width={250} height={100} /> */}
        <p className="font-bold">GALLERY-STUDIO</p>
        <p>
          &copy; {new Date().getFullYear()} Gallery-Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
};
