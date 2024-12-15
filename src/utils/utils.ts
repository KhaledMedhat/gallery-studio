import { createHash } from "crypto";
import { type Comment } from "~/types/types";

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export const isURLActive = (pathname: string, url: string) => {
  return pathname === url;
};

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function generateOTP(): string {
  // Generate a random number between 0 and 999999
  const otp = Math.floor(Math.random() * 1000000);

  // Pad the number with leading zeros if necessary to ensure it's 6 digits
  return otp.toString().padStart(6, "0");
}

export function getInitials(
  firstName: string | undefined,
  lastName: string | undefined,
) {
  if (firstName && lastName) {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase(); // Get the first letter of each part
    return `${firstInitial}${lastInitial}`; // Join the initials into a string
  }
}

export function formatNumber(number: number) {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number;
}

export function typeOfFile(fileType: string | null | undefined) {
  if (!fileType) return null;
  if (fileType.includes("image")) {
    if (fileType.includes("gif")) {
      return "GIF";
    } else {
      return "Image";
    }
  }
  if (fileType.includes("video")) return "Video";
}

export function extractUsername(comment: string) {
  const regex = /@\w+/;
  const match = regex.exec(comment);
  return match ? match[0] : null;
}

export function extractUsernameWithoutAt(comment: string) {
  const regex = /\w+/;
  const match = regex.exec(comment);
  return match ? match[0] : null;
}

export function extractComment(comment: string) {
  const regex = /@\w+\s*(.*)/;
  const match = regex.exec(comment);
  return match ? match[1] : comment;
}

export function buildCommentHierarchy(
  comments: Comment[],
  parentId: string | null = null,
): CommentWithReplies[] {
  return comments
    .filter((comment) => comment.parentId === parentId)
    .map((comment) => ({
      ...comment,
      replies: buildCommentHierarchy(comments, comment.id),
    }));
}
