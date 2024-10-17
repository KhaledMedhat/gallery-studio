import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "32MB" },
    video: { maxFileSize: "256MB" },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url);

      return { fileInfo: file, metadata };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
