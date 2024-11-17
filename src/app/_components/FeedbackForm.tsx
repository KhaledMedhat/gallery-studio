'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const FeedbackForm = () => {
    const router = useRouter();
    const formSchema = z.object({
        content: z.string().min(1, "Content is required"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });
    const { mutate: sendFeedback, isPending } =
        api.feedback.postFeedback.useMutation({
            onSuccess: () => {
                form.reset()
                router.refresh()
                toast({
                    title: "Feedback sent Successfully",
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
        sendFeedback({
            content: data.content
        })
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 p-5"
        >
            <h1 className="mb-2 text-center text-2xl font-bol">Send Feedback</h1>
            <Form {...form}>
                <form
                    id="feedback-form"
                    onSubmit={form.handleSubmit(onSubmitForget)}
                    className="w-full space-y-8"
                >
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Feedback
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Your feedback .."
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            <Button
                form="feedback-form"
                type="submit"
                className="mt-6 w-full"
                disabled={isPending}
            >
                {isPending ? (
                    <>
                        <LoaderCircle size={16} className="mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    "Send Feedback"
                )}
            </Button>

        </motion.div>
    )
}

export default FeedbackForm