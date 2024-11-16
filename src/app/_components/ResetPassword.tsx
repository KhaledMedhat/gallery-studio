import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const ResetPassword: React.FC<{ userEncryptedId: string }> = ({ userEncryptedId }) => {
    const router = useRouter();
    const formSchema = z
        .object({
            newPassword: z.string().min(8, "Password is required"),
            confirmNewPassword: z.string().min(8, "Password is required"),
        })
        .refine((data) => data.newPassword === data.confirmNewPassword, {
            message: "Passwords do not match",
            path: ["confirmNewPassword"],
        })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    });
    const { mutate: resetPassword, isPending } = api.user.resetPassword.useMutation({
        onSuccess: () => {
            toast({
                title: "Password Reset Successfully",
                description: 'Please login with your new password',
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

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        resetPassword({
            id: userEncryptedId,
            password: data.newPassword,
        });
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <h1 className="mb-2 text-center text-3xl font-bold text-gray-100">Password Reset</h1>
            <Form {...form}>
                <form
                    id="reset-password-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-8"
                >
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className={`${form.formState.errors.newPassword
                                            ? "text-red-500"
                                            : "text-gray-100"
                                            }`}
                                    >
                                        New Password
                                    </FormLabel>
                                    <FormControl className="bg-transparent">
                                        <Input
                                            className="text-gray-100"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your email new password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className={`${form.formState.errors.confirmNewPassword
                                            ? "text-red-500"
                                            : "text-gray-100"
                                            }`}
                                    >
                                        Confirm New Password
                                    </FormLabel>
                                    <FormControl className="bg-transparent">
                                        <Input
                                            className="text-gray-100"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Confirm your new password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            <Button
                form="reset-password-form"
                type="submit"
                className="mt-6 w-full transform rounded-md bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-gray-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <LoaderCircle size={16} className="mr-2 animate-spin" />
                        Resetting...
                    </>
                ) : (
                    "Reset"
                )}
            </Button>

        </motion.div>
    );
};

export default ResetPassword;