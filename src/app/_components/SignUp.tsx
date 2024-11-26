"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useFileStore, useUserStore } from "~/store";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import Image from "next/legacy/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight, LoaderCircle, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { stages } from "~/constants/Stages";
import { deleteFileOnServer } from "../actions";
import { useToast } from "~/hooks/use-toast";
import AuthButtons from "./AuthButtons";
import UploadthingButton from "./UploadthingButton";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import AnimatedCircularProgressBar from "~/components/ui/animated-circular-progress-bar";
import OTP from "./OTP";

const SignUp = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const isCodeVerifying = searchParams.get('ctxVerificationCode')
  const router = useRouter();
  const [stage, setStage] = useState<number>(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { fileUrl, fileKey, isUploading, progress, setFileUrl } =
    useFileStore();
  const { mutate: sendingOTP, isPending: isSendingOTP } =
    api.user.sendingOTP.useMutation({
      onSuccess: async () => {
        setIsLoading(isSendingOTP);
        router.push("/sign-up?ctxVerificationCode=true");
      },
      onError: (e) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: e.message,
        });
      },
    });
  const userRegistryInfo = useUserStore((state) => state.setUserRegistry);
  const userInfo = useUserStore((state) => state.userRegistrationInfo);
  const userImage = useUserStore((state) => state.setUserImage);
  const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(1, "Email is required"),
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(1, "Password is required")
      .min(8, "Password cannot be less than 8 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: '',
      username: "",
      email: "",
      password: "",
    },
  });
  const { mutate: verifyEmail, isPending: isVerifyEmailPending } = api.user.verifyEmail.useMutation({
    onSuccess: async () => {
      setIsLoading(true);
      userRegistryInfo({
        firstName: form.getValues("firstName"),
        lastName: form.getValues("lastName"),
        username: form.getValues('username'),
        email: form.getValues("email"),
        password: form.getValues("password"),
        image: "",
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      if (stage < stages.length - 1) {
        setStage((prev) => prev + 1);
      }
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
      });
    },
  });
  const onSubmitFirstStage = async (data: z.infer<typeof formSchema>) => {
    verifyEmail({ email: data.email, username: data.username });
  };

  const onFinishRegistry = () => {
    const fullName = userInfo.firstName + " " + userInfo.lastName;
    if (fileUrl) {
      userImage(fileUrl);
      sendingOTP({ name: fullName, email: userInfo.email });
    }
    sendingOTP({ name: fullName, email: userInfo.email });
  };
  const renderStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <Form {...form}>
            <form
              id="sign-up-form"
              onSubmit={form.handleSubmit(onSubmitFirstStage)}
              className="w-full"
            >
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${form.formState.errors.firstName
                          ? "text-red-500"
                          : "text-gray-100"
                          }`}
                      >
                        First Name
                      </FormLabel>
                      <FormControl className="bg-transparent">
                        <Input
                          placeholder="John"
                          {...field}
                          className="text-gray-100"
                        />
                      </FormControl>
                      <FormDescription>Enter your First name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`${form.formState.errors.lastName
                          ? "text-red-500"
                          : "text-gray-100"
                          }`}
                      >
                        Last Name
                      </FormLabel>
                      <FormControl className="bg-transparent">
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="text-gray-100"
                        />
                      </FormControl>
                      <FormDescription>Enter your Last name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${form.formState.errors.username
                        ? "text-red-500"
                        : "text-gray-100"
                        }`}
                    >
                      Username
                    </FormLabel>
                    <FormControl className="bg-transparent">
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="text-gray-100"
                      />
                    </FormControl>
                    <FormDescription>This username will be shown to other users.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${form.formState.errors.email
                        ? "text-red-500"
                        : "text-gray-100"
                        }`}
                    >
                      Email
                    </FormLabel>
                    <FormControl className="bg-transparent">
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="text-gray-100"
                      />
                    </FormControl>
                    <FormDescription>Enter your email address.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${form.formState.errors.password
                        ? "text-red-500"
                        : "text-gray-100"
                        }`}
                    >
                      Password
                    </FormLabel>
                    <FormControl className="bg-transparent">
                      <Input
                        type="password"
                        {...field}
                        className="text-gray-100"
                      />
                    </FormControl>
                    <FormDescription>Enter your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      case 1:
        return file && fileUrl && progress === 100 ? (
          <div className="relative">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={fileUrl}
                alt="Profile Picture"
                layout="fill"
                className="h-full w-full cursor-pointer rounded-full object-cover"
              />
            </AspectRatio>
            {fileUrl && (
              <Button
                variant="ghost"
                className="absolute right-0 top-0 text-primary"
                onClick={async () => {
                  if (fileKey) {
                    await deleteFileOnServer(fileKey);
                    setFileUrl("");
                  }
                }}
              >
                <X size={25} />
              </Button>
            )}
          </div>
        ) : isUploading ? (
          <AnimatedCircularProgressBar
            className="m-auto"
            max={100}
            min={0}
            value={progress}
            gaugePrimaryColor="#d4d4d4"
            gaugeSecondaryColor="#171717"
          />
        ) : (
          <UploadthingButton
            setFile={setFile}
            label="Profile Image"
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex h-full">
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
        <div className="absolute top-6 sm:top-10 px-10 flex w-full items-center justify-between">
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
              href="/sign-in"
              className="font-medium text-gray-100 hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md flex items-center"
        >
          {isCodeVerifying ?
            <OTP />
            :

            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <h1 className="text-center text-3xl font-bold text-gray-100">
                  {stages[stage]?.title}
                </h1>
                <p className="text-center text-gray-100">
                  {stages[stage]?.subtitle}
                </p>
                {renderStageContent()}
                <div className="flex justify-between">
                  {stage > 0 && (
                    <Button
                      type="button"
                      onClick={() => setStage((prev) => prev - 1)}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Back
                    </Button>
                  )}
                  <Button
                    form={stage === 0 ? "sign-up-form" : undefined}
                    type={stage === 0 ? "submit" : "button"}
                    className={`${stage === 0 ? "w-full" : "ml-auto"
                      } ${progress !== 100 && 'hidden'} transform rounded-md border border-solid border-white bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                    disabled={isLoading || isVerifyEmailPending}
                    onClick={
                      stage === stages.length - 1 ? onFinishRegistry : undefined
                    }
                  >
                    {isLoading || isVerifyEmailPending ? (
                      <div className="flex items-center ">
                        <LoaderCircle size={16} className="mr-2 animate-spin" />
                        Processing...
                      </div>
                    ) : stage === stages.length - 1 ? (
                      fileUrl && progress === 100 ? (
                        "Submit"
                      ) : (
                        "Continue Without Profile Picture"
                      )
                    ) : (
                      <div className="flex items-center">
                        Next < ArrowRight size={16} className="ml-2" />
                      </div>
                    )}
                  </Button>
                </div>
                <div className="flex items-center">
                  <hr className="inline-block grow-[4] border-white" />
                  <span className="text-md flex flex-grow justify-center text-center uppercase text-white">
                    Or login with
                  </span>
                  <hr className="inline-block grow-[4] border-white" />
                </div>

                <AuthButtons />
              </motion.div>
            </AnimatePresence>
          }

        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
