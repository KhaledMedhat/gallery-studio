import { createHash } from "crypto";
import { type Comment } from "~/types/types";

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
export function windowSize() {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return 5;
  } else {
    return 10;
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

export function extractUsername(comment: string) {
  const regex = /@\w+/;
  const match = regex.exec(comment);
  return match ? match[0] : null;
}
export function getMention(text: string) {
  const regex = /@(\w+)$/;
  const match = regex.exec(text);
  return match ? match[1] : null;
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

export default async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  const { width, height } = crop;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    width,
    height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () =>
      reject(new Error("Failed to load image")),
    );
    img.src = url;
  });
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
