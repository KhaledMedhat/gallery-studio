/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

export const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string;
        description: string;
        content?: React.ReactNode | any;
    }[];
    contentClassName?: string;
}) => {
    const [activeCard, setActiveCard] = useState<number>(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
        // target: ref,
        container: ref,
        offset: ["start start", "end start"],

    });
    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => (index + 0.1) / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (cardsBreakpoints[acc] && distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0
        );
        setActiveCard(closestBreakpointIndex);
    });

    const backgroundColors = [
        "#0f172a",
        "#000000",
        "#171717",
    ];
    const linearGradients = useMemo(() => [
        "linear-gradient(to bottom right, #06b6d4, #10b981)",
        "linear-gradient(to bottom right, #ec4899, #6366f1)",
        "linear-gradient(to bottom right, #f97316 , #eab308)",
    ], []);

    const [backgroundGradient, setBackgroundGradient] = useState(
        linearGradients[0]
    );

    useEffect(() => {
        setBackgroundGradient(linearGradients[activeCard]);
    }, [activeCard, linearGradients]);

    return (
        <motion.div
            animate={{
                backgroundColor: backgroundColors[activeCard % backgroundColors.length],
            }}
            className="h-[30rem] overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10"
            ref={ref}
        >
            <div className="div relative flex items-start px-4">
                <div className="max-w-2xl">
                    {content.map((item, index) => (
                        <div key={index} className="my-20">
                            <motion.h2
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="text-2xl font-bold text-muted-foreground"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="text-lg text-white max-w-sm mt-10"
                            >
                                {item.description}
                            </motion.p>
                        </div>
                    ))}
                    <div className="h-40" />
                </div>
            </div>
            <div
                style={{ background: backgroundGradient }}
                className={cn(
                    "hidden lg:block h-60 w-80 text-center rounded-md sticky bg-white top-10 overflow-hidden",
                    contentClassName
                )}
            >
                {content[activeCard]?.content ?? null}
            </div>
        </motion.div>
    );
};
