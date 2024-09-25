"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/hooks/use-toast";
import { useUserStore } from "~/store";
import { api } from "~/trpc/react";

const OTP = () => {
  const router = useRouter();
  const { toast } = useToast();
  const userRegistryInfo = useUserStore((state) => state.userRegistrationInfo);
  const FormSchema = z.object({
    otp: z.string().min(6, {
      message: "Your one-time password must be 6 digits.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });
  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      toast({
        description: "Your account has been created successfully &#127881;.",
      });
      router.push("/sign-in");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    createUser.mutate({
      name: userRegistryInfo.fullName,
      email: userRegistryInfo.email,
      password: userRegistryInfo.password,
      image: userRegistryInfo.image,
      otp: data.otp,
    });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[#171717] p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-left text-3xl font-bold text-gray-100">
          OTP Verification
        </h1>
      </div>
      <div className="w-full max-w-4xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSeparator />
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

            <Button
              className="transform rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              type="submit"
            >
              Complete Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OTP;
