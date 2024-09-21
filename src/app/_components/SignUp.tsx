"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setUserRegistry } from "~/redux/state/appSlice";
import { useAppDispatch } from "~/redux/store/hooks";
import { api } from "~/trpc/react";

const SignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const sendingOTP = api.user.sendingOTP.useMutation({
    onSuccess: async () => {
      router.push("/otp");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendingOTP.mutate({
      name,
      email,
    });
    dispatch(
      setUserRegistry({
        name,
        email,
        password,
      }),
    );
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
