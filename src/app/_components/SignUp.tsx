"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { api } from "~/trpc/react";
import { useUserStore } from "~/store";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Trash2, Upload } from "lucide-react";
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
import { useUploadThing } from "~/utils/uploadthing";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { deleteFileOnServer } from "../actions";
import { useToast } from "~/hooks/use-toast";
import { ToastAction } from "~/components/ui/toast";
import { Progress } from "~/components/ui/progress";
import AuthButtons from "./AuthButtons";

const SignUp = () => {
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | undefined>("");
  const [imageKey, setImageKey] = useState<string | undefined>("");
  const router = useRouter();
  const [stage, setStage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setImageUrl(res[0]?.url);
      setImageKey(res[0]?.key);
    },
    onUploadProgress: (progress) => {
      setIsUploading(true);
      setProgress(progress);
    },
    onUploadError: (e) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles).catch((e) => {
        console.log(e);
      });
    },
    [startUpload],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  const { mutate: sendingOTP, isPending: isSendingOTP } =
    api.user.sendingOTP.useMutation({
      onSuccess: async () => {
        setIsLoading(isSendingOTP);
        router.push("/sign-up/otp_verification");
      },
      onError: (e) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: e.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
    });
  const userRegistryInfo = useUserStore((state) => state.setUserRegistry);
  const userInfo = useUserStore((state) => state.userRegistrationInfo);
  const userImage = useUserStore((state) => state.setUserImage);
  const formSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(8, "Password is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });
  const { mutate: verifyEmail } = api.user.verifyEmail.useMutation({
    onSuccess: async () => {
      setIsLoading(true);
      userRegistryInfo({
        fullName: form.getValues("fullName"),
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
    verifyEmail({ email: data.email });
  };

  const onFinishRegistry = () => {
    if (imageUrl) {
      userImage(imageUrl);
      sendingOTP({ name: userInfo.fullName, email: userInfo.email });
    }
    sendingOTP({ name: userInfo.fullName, email: userInfo.email });
  };
  const renderStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <Form {...form}>
            <form
              id="sign-up-form"
              onSubmit={form.handleSubmit(onSubmitFirstStage)}
              className="w-full space-y-8"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`${
                        form.formState.errors.fullName
                          ? "text-red-500"
                          : "text-gray-100"
                      }`}
                    >
                      Full Name
                    </FormLabel>
                    <FormControl className="bg-transparent">
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="text-gray-100"
                      />
                    </FormControl>
                    <FormDescription>Enter your full name.</FormDescription>
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
                      className={`${
                        form.formState.errors.password
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
        return imageUrl && progress === 100 ? (
          <Image
            src={imageUrl}
            style={{ objectFit: "cover", height: "200px" }}
            alt="Profile Picture"
            width={200}
            height={200}
            className="mx-auto my-6 rounded-full"
          />
        ) : isUploading ? (
          <Progress value={progress} />
        ) : (
          <div className="space-y-4">
            <Label
              htmlFor="profileImage"
              className="text-sm font-medium text-gray-100"
            >
              Profile Image
            </Label>
            <div className="flex w-full items-center justify-center">
              <div
                {...getRootProps()}
                className={`bg-transparent ${isDragActive && "border-2 border-dashed border-gray-700"} flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white`}
              >
                <Upload className="mb-3 h-10 w-10 text-gray-100" />
                <p className="mb-2 text-sm text-gray-100">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-100">
                  PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <Input
                {...getInputProps()}
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
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
            <Link
              href="/"
              className="flex items-center gap-2 font-medium text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
        <div className="absolute right-10 top-10 text-center">
          <Link
            href="/sign-in"
            className="font-medium text-gray-100 hover:underline"
          >
            Log in
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-2 text-center text-3xl font-bold text-gray-100">
                {stages[stage]?.title}
              </h1>
              <p className="mb-6 text-center text-gray-100">
                {stages[stage]?.subtitle}
              </p>
              {renderStageContent()}
              {imageUrl && stage !== 0 && (
                <Button
                  className="flex w-full bg-gray-200 text-primary hover:bg-gray-300"
                  onClick={async () => {
                    if (imageKey) {
                      await deleteFileOnServer(imageKey);
                      setImageUrl(undefined);
                    }
                  }}
                >
                  <Trash2 fill="#171717" className="h-4 w-4" />
                  Delete
                </Button>
              )}
              <div className="mt-6 flex justify-between">
                {stage > 0 && (
                  <Button
                    type="button"
                    onClick={() => setStage((prev) => prev - 1)}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  form={stage === 0 ? "sign-up-form" : undefined}
                  type={stage === 0 ? "submit" : "button"}
                  className={`${
                    stage === 0 ? "w-full" : "ml-auto"
                  } transform rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                  disabled={isLoading}
                  onClick={
                    stage === stages.length - 1 ? onFinishRegistry : undefined
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : stage === stages.length - 1 ? (
                    imageUrl ? (
                      "Submit"
                    ) : (
                      "Continue Without Profile Picture"
                    )
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              <div className="my-6 flex items-center">
                <hr className="inline-block grow-[4] border-white" />
                <span className="text-md flex flex-grow justify-center text-center uppercase text-white">
                  Or log in with
                </span>
                <hr className="inline-block grow-[4] border-white" />
              </div>

              <AuthButtons />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
