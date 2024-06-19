/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mozeeshan.s3.eu-west-2.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pub-63262c5a2dfe44a886768b955c3b3ba5.r2.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
