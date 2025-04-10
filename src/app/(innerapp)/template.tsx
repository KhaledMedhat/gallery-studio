"use client";
import { motion } from "framer-motion";
export default function Template({ children }: { children: React.ReactElement }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {children}
        </motion.div>
    );
}
