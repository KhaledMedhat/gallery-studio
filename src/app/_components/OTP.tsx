"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "~/store";
import { api } from "~/trpc/react";

const OTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const userRegistryInfo = useUserStore((state) => state.userRegistrationInfo)
  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      router.push("/sign-in");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser.mutate({
      name: userRegistryInfo.name,
      email: userRegistryInfo.email,
      password: userRegistryInfo.password,
      otp,
    });
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default OTP;
