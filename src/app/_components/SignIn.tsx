"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import AuthButton from "./AuthButton";
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

const SignIn = () => {
  const router = useRouter();
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
  const { mutate: userGallery, isPending: isPendingGallery } =
    api.gallery.getUserGallery.useMutation({
      onSuccess: async (data) => {
        if (data?.slug) {
          router.push(`/galleries/${data?.slug}`);
        }
      },
    });

  const { mutate: createUser, isPending: isPendingLogin } =
    api.user.login.useMutation({
      onSuccess: async (data) => {
        const userId = data.user?.id;
        if (userId) {
          userGallery({ id: userId });
        }
      },
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createUser({
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
        <div className="absolute left-10 top-10 text-center">
          <Button className="border border-solid border-gray-100 bg-transparent hover:bg-transparent">
            <Link href="/" className="font-medium text-gray-100 flex gap-2 items-center">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
        <div className="absolute right-10 top-10 text-center">
          <Link
            href="/sign-up"
            className="font-medium text-gray-100 hover:underline"
          >
            Create an account
          </Link>
        </div>
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
                        <Input placeholder="you@example.com" {...field} />
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
                            href="/forgot-password"
                            className="text-sm text-gray-100 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                      </div>
                      <FormControl className="bg-transparent">
                        <Input {...field} type="password" />
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
            disabled={isPendingLogin || isPendingGallery}
          >
            {isPendingLogin || isPendingGallery ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

          <AuthButton />
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
