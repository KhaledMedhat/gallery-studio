import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
const ForgetPassword = () => {
  const formSchema = z.object({
    forgottenEmail: z.string().email().toLowerCase(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      forgottenEmail: "",
    },
  });
  const { mutate: sendResetPasswordLink, isPending } =
    api.user.sendResetPasswordLink.useMutation({
      onSuccess: () => {
        toast({
          title: "Sent Successfully",
          description: "Please check your email to reset your password",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      },
    });

  const onSubmitForget = (data: z.infer<typeof formSchema>) => {
    sendResetPasswordLink({
      email: data.forgottenEmail,
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-100">
        Forget Password
      </h1>
      <Form {...form}>
        <form
          id="forget-password-form"
          onSubmit={form.handleSubmit(onSubmitForget)}
          className="w-full space-y-8"
        >
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="forgottenEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      form.formState.errors.forgottenEmail
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
                    Enter your email address to send a password reset link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <Button
        form="forget-password-form"
        type="submit"
        className="mt-6 w-full transform rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <LoaderCircle size={16} className="mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </motion.div>
  );
};

export default ForgetPassword;
