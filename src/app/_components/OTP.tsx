"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { useToast } from "~/hooks/use-toast";
import { useUserStore } from "~/store";
import { api } from "~/trpc/react";

const OTP = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [timer, setTimer] = useState<number>(35);
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  const userRegistryInfo = useUserStore((state) => state.userRegistrationInfo);
  const fullName = userRegistryInfo.firstName + " " + userRegistryInfo.lastName;
  const FormSchema = z.object({
    otp: z.string().min(6, {
      message: "Your one-time password must be 6 digits.",
    }),
  });
  const startTimer = () => {
    setIsTimerFinished(false);
    setTimer(35); // Reset timer to 35 seconds
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  };
  useEffect(() => {
    startTimer();
  }, []);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });
  const { mutate: deleteOtp } = api.user.deleteOtp.useMutation();

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        deleteOtp({ email: userRegistryInfo.email });
      },
      5 * 60 * 1000,
    ); // 5 minutes in milliseconds

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [deleteOtp, userRegistryInfo.email]);

  const { mutate: resendOtp } = api.user.sendingOTP.useMutation({
    onMutate: () => {
      deleteOtp({ email: userRegistryInfo.email });
    },
    onSuccess: () => {
      startTimer();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });
  const { mutate: createUser, isPending } = api.user.create.useMutation({
    onSuccess: async () => {
      toast({
        description: <span>Your account has been created successfully 🎉</span>,
      });
      router.push("/sign-in");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
  });
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createUser({
      firstName: userRegistryInfo.firstName,
      lastName: userRegistryInfo.lastName,
      username: userRegistryInfo.username,
      email: userRegistryInfo.email,
      password: userRegistryInfo.password,
      image: userRegistryInfo.image,
      otp: data.otp,
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div>
        <h1 className="text-left text-3xl font-bold text-white">
          OTP Verification
        </h1>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-6 text-white">
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6">
              <Button
                disabled={isPending}
                className="transform rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                type="submit"
              >
                {isPending ? <LoaderCircle size={20} /> : "Complete Sign Up"}
              </Button>

              <div>
                {isTimerFinished ? (
                  <Button
                    variant="link"
                    onClick={(e) => {
                      e.preventDefault();
                      resendOtp({
                        name: fullName,
                        email: userRegistryInfo.email,
                      });
                    }}
                    className="text-white"
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <div>
                    {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </div>
            </div>
            {!isTimerFinished && (
              <div className="w-full text-white">
                <p>You will be able to resend OTP after 35 seconds.</p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OTP;
