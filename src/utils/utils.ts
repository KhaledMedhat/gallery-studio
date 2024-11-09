import { createHash } from "crypto";

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

export function getInitials(name: string | undefined) {
  if (name) {
    const parts = name.split(" "); // Split the name by spaces
    const initials = parts.map((part) => part.charAt(0).toUpperCase()); // Get the first letter of each part
    return initials.join(""); // Join the initials into a string
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
