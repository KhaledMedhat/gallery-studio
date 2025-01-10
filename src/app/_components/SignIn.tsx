"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import AuthButtons from "./AuthButtons";
import { useToast } from "~/hooks/use-toast";
import ResetPassword from "./ResetPassword";
import ForgetPassword from "./ForgetPassword";
import { useState } from "react";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPasswordReset = searchParams.get("ctxFP");
  const userEncryptedId = searchParams.get("ctxId");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { toast } = useToast();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: userLogin, isPending: isPendingLogin } =
    api.user.login.useMutation({
      onSuccess: () => {
        router.push("/showcases");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      },
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    userLogin({
      email: data.email,
      password: data.password,
    });
  };
  return (
    <div className="flex min-h-screen">
      <div className="hidden items-center justify-center bg-neutral-300 p-12 lg:flex lg:w-1/2">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            GalleryStudio
          </h1>
          <p className="text-lg text-gray-600">
            Discover, share, and celebrate art in our vibrant online community.
            Join us to showcase your creativity and connect with artists
            worldwide.
          </p>
        </div>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center bg-[#171717] p-8 lg:w-3/4">
        <div className="absolute top-10 flex w-full items-center justify-between px-10">
          <div className="text-center">
            <Button className="border border-solid border-gray-100 bg-transparent hover:bg-transparent">
              <Link
                href="/"
                className="flex items-center gap-2 font-medium text-gray-100"
              >
                <ArrowLeft size={16} />
                Home
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <Link
              href="/sign-up"
              className="font-medium text-gray-100 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
        {isPasswordReset ? (
          userEncryptedId ? (
            <ResetPassword userEncryptedId={userEncryptedId} />
          ) : (
            <ForgetPassword />
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <h1 className="mb-2 text-center text-3xl font-bold text-gray-100">
              Welcome Back!
            </h1>
            <Form {...form}>
              <form
                id="sign-in-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={`${
                            form.formState.errors.email
                              ? "text-red-500"
                              : "text-gray-100"
                          }`}
                        >
                          Email
                        </FormLabel>
                        <FormControl className="bg-transparent">
                          <Input
                            className="text-gray-100"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel
                            className={`${
                              form.formState.errors.password
                                ? "text-red-500"
                                : "text-gray-100"
                            }`}
                          >
                            Password
                          </FormLabel>
                          <div className="text-center">
                            <Link
                              href="/sign-in?ctxFP=true"
                              className="text-sm text-gray-100 hover:underline"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                        </div>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...field}
                              className="bg-transparent text-gray-100"
                            />
                            {field.value.length > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 hover:bg-transparent"
                              >
                                {showPassword ? (
                                  <Eye color="white" />
                                ) : (
                                  <EyeOff color="white" />
                                )}
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>Enter your password.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
            <Button
              form="sign-in-form"
              type="submit"
              className="mt-6 w-full transform rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              disabled={isPendingLogin}
            >
              {isPendingLogin ? (
                <>
                  <LoaderCircle size={16} className="mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="my-6 flex items-center">
              <hr className="inline-block grow-[4] border-white" />
              <span className="text-md flex flex-grow justify-center text-center uppercase text-white">
                Or log in with
              </span>
              <hr className="inline-block grow-[4] border-white" />
            </div>

            <AuthButtons />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
