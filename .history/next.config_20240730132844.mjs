/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "",
      // },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "socialmediaplatform.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "image-web-storage.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
