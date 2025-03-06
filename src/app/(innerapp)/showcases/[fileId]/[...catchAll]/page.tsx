'use client'
import { useRouter } from "next/navigation";

export default function CatchAll() {
    const router = useRouter()
    router.back()
}