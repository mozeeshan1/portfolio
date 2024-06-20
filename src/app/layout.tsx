import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { Providers } from "../components/theme-provider";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mohammed Zeeshan's portfolio",
  description:
    "Explore Mohammed Zeeshan's portfolio showcasing expertise in data science and software development, featuring impactful projects that blend innovation with practical solutions.",
  alternates: { canonical: "https://mozeeshan.com/" },
  manifest: "/manifest.json",
  authors: { name: "Mohammed Zeeshan", url: "https://mozeeshan.com" },
  generator: "Next.js",
  keywords: [
    "react",
    "portfolio",
    "nextjs",
    "mohammed zeeshan",
    "zeeshan",
    "mohammed",
  ],
  creator: "Mohammed Zeeshan",
  publisher: "Cloudflare",
  robots: "index, follow",
  icons: "/favicon.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-800`}>
        <Providers>
          <Header />
          <Suspense
            fallback={
              <div className="flex justify-center items-center gap-24 w-screen h-screen">
                <p>Loading...</p>
              </div>
            }
          >
            {children}
          </Suspense>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
