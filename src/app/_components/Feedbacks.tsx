"use client";
import BlurFade from "~/components/ui/blur-fade";
import { ArrowDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import FeedbackForm from "./FeedbackForm";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import { getInitials, windowSize } from "~/utils/utils";
import { Skeleton } from "~/components/ui/skeleton";
import CustomDrawer from "./CustomDrawer";
import { DrawerEnum, type User } from "~/types/types";

const Feedbacks: React.FC<{ currentUser: User | null | undefined }> = ({ currentUser }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = api.feedback.allFeedbacks.useQuery({
    page: currentPage,
    limit,
  });

  const feedbacks = data?.feedbacks ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  return (
    <div className="flex h-full w-full flex-col items-center">
      {isLoading ? (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {Array.from({
            length: windowSize(),
          }).map((_, idx) => (
            <Skeleton key={idx} className="h-[100px] w-[250px] rounded-md" />
          ))}
        </div>
      ) : feedbacks.length > 0 ? (
        <div className="flex h-full flex-col items-center justify-between">
          <div className="flex w-full flex-col flex-wrap items-center gap-8">
            <CustomDrawer
              currentUser={currentUser}
              drawerAppearance={DrawerEnum.ADD_FEEDBACK}
              drawerTitle="Add Feedback"
              drawerDescription="Add feedback to help us improve"
            />
            <div className="flex w-full flex-wrap justify-center gap-4">
              {feedbacks.map((feedback) => (
                <BlurFade key={feedback.id} delay={0.6} inView>
                  <Card key={feedback.id} className="w-[300px] p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={feedback.user?.profileImage?.imageUrl ?? ""}
                            />
                            <AvatarFallback>
                              {getInitials(
                                feedback.user?.firstName ?? "",
                                feedback.user?.lastName ?? "",
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="text-sm font-medium">
                              {feedback.user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {feedback.user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm">{feedback.feedback}</p>
                    </div>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
          <Pagination className="m-6">
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
          </Pagination>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center text-2xl font-bold">
          No feedbacks yet
          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2 p-5 text-center">
              <p>
                Let us know about your experience with Gallery Studio from below
              </p>
              <ArrowDown className="animate-bounce" size={16} />
            </div>
            <FeedbackForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
