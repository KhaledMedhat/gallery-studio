import { createHash } from "crypto";
import type {
  ClientUploadedFileData,
  UploadedFileData,
} from "uploadthing/types";
import type { fileConverter, Comment } from "~/types/types";

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export const calculateClosestAspectRatio = (width: number, height: number) => {
  const aspectRatio16_9 = 16 / 9;
  const aspectRatio1_1 = 1;

  const currentAspectRatio = width / height;

  // Calculate the difference between the current aspect ratio and the standard ones
  const diff16_9 = Math.abs(currentAspectRatio - aspectRatio16_9);
  const diff1_1 = Math.abs(currentAspectRatio - aspectRatio1_1);

  // Determine which standard aspect ratio is closer
  if (diff16_9 < diff1_1) {
    // Closer to 16:9
    return { width: width, height: width / aspectRatio16_9 };
  } else {
    // Closer to 1:1
    return { width: width, height: width / aspectRatio1_1 };
  }
};
export function windowSize(minNumber:number, maxNumber:number) {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return minNumber;
  } else {
    return maxNumber;
  }
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

export function getInitials(firstName: string, lastName: string) {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase(); // Get the first letter of each part
  return `${firstInitial}${lastInitial}`; // Join the initials into a string
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


export function extractUsernameAndText(comment: string | undefined | null) {
  const regex = /^(.*?)\s*\[?@(\w+)\]?\s*(.*)$/;
  const match = regex.exec(comment ?? "");
  if (match) {
    return {
      previousText: match[1] ?? null,
      username: match[2],
      followingText: match[3] ?? null,
    };
  }
  // If no mention exists, return the entire input as followingText
  return { previousText: null, username: null, followingText: comment };
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

export const blobUrlToFile = async (
  blobUrl: string,
  fileName: string,
): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

export function getCommentWithHighestRatio(comments: Comment[]): Comment[] {
  let highestRatioComment: Comment[] = [];
  let highestRatio = -1;

  comments.forEach((comment) => {
    const likesCount = comment.likedUsers ? comment.likedUsers.length : 0;
    const repliesCount = comment.replies ? comment.replies.length : 0;
    const ratio = repliesCount === 0 ? likesCount : likesCount / repliesCount;

    if (ratio > highestRatio) {
      highestRatio = ratio;
      highestRatioComment = [comment];
    }
  });
  return highestRatioComment;
}

export async function prepareFileForUpload(
  file: fileConverter,
  croppedImage: string,
  showcaseOriginalName: string,
  isUploadedShowcaseEditing: boolean,
  startUpload: (
    files: File[],
    input?: undefined,
  ) => Promise<
    | ClientUploadedFileData<{
        fileInfo: UploadedFileData;
        metadata: object;
      }>[]
    | undefined
  >,
) {
  if (isUploadedShowcaseEditing) {
    if (file && croppedImage) {
      if (typeOfFile(file.type) === "Image" || "GIF") {
        const croppedImageFile = await blobUrlToFile(
          croppedImage,
          showcaseOriginalName,
        );
        await startUpload([croppedImageFile]);
      } else {
        const convertedVideoFromUrl = await blobUrlToFile(
          file.url,
          showcaseOriginalName,
        );
        await startUpload([convertedVideoFromUrl]);
      }
    }
  } else {
    const originalShowcaseImageFile = await blobUrlToFile(
      file.url,
      showcaseOriginalName,
    );
    await startUpload([originalShowcaseImageFile]);
  }
}
