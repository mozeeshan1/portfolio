/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mozeeshan.s3.eu-west-2.amazonaws.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig
