'use client'
import BlurFade from "~/components/ui/blur-fade"
import Feedback from "./Feedback"
import { ArrowDown, Dot } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "~/components/ui/pagination"
import FeedbackForm from "./FeedbackForm"
import { useState } from "react"
import { api } from "~/trpc/react"

const FeedbacksPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 5

    const { data, isLoading } = api.feedback.allFeedbacks.useQuery({
        page: currentPage,
        limit
    })

    const feedbacks = data?.feedbacks ?? []
    const totalPages = data?.totalPages ?? 1

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return
        if (newPage > totalPages) return
        setCurrentPage(newPage)
    }
    return (
        <div className="flex items-center gap-20 flex-col justify-center mt-12 w-full">
            {feedbacks.length > 0 ?
                <div>
                    <div className="w-full flex flex-wrap gap-4 justify-center">
                        {feedbacks.map((feedback) => (
                            <BlurFade key={feedback.id} delay={0.6} inView>
                                <Feedback feedback={feedback} />
                            </BlurFade>
                        ))}
                    </div>
                    {isLoading ?
                        <Dot size={250} className="animate-bounce" />
                        :
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={`/feedback`}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            onClick={() => handlePageChange(index + 1)}
                                            href={`/feedback`}
                                            isActive={currentPage === index + 1}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href={`/feedback`}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>}
                </div>
                :
                <div className="flex items-center justify-center text-2xl font-bold">No feedbacks yet</div>
            }

            <div className="w-full flex items-center flex-col gap-2">
                <div className="flex gap-2 flex-col items-center text-center p-5">
                    <p>Let us know about your experience with Gallery Studio from below</p>
                    <ArrowDown className="animate-bounce" size={16} />
                </div>
                <FeedbackForm />
            </div>
        </div>
    )
}

export default FeedbacksPage