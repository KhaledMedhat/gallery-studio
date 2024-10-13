"use client"


import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "~/components/ui/dialog"

export function Modal({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()

    const handleOpenChange = () => {
        router.back()
    }

    return (
        <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
            <DialogOverlay className=" bg-background/60" >
                <DialogContent className="overflow-y-hidden">
                  <DialogTitle>Modal Title</DialogTitle>
                    {children}
                  <DialogDescription>Modal description</DialogDescription>
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    )
}