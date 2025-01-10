/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@pqina/pintura", "@pqina/react-pintura"],
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "utfs.io",
      },
      {
        hostname: "lh4nvfyr5d.ufs.sh",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
