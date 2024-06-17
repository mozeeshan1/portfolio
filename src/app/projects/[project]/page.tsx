"use client";
import React, { useEffect, useState } from "react";
import supabase from "../../../supabase/supabaseClient";
import { motion } from "framer-motion";
import Image from "next/image";
import Slider from "react-slick";
import parseText from "./textParse";
import { navigate } from "@/libraries/redirect";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface GroupedKeys {
  [key: number]: string[];
}

export const runtime = "edge";

// This function extracts numbers from a string and returns them as an integer.
const extractNumber = (str: string) => {
  const match = str.match(/(\d+)$/);
  return match ? parseInt(match[0], 10) : -1;
};

// Define sort order for different types of content.
const typeOrder = {
  paraTitle: 1,
  paragraph: 2,
  media: 3,
};

// Function to get the sort priority based on the type
const getTypePriority = (key: string) => {
  if (key.startsWith("paraTitle")) return typeOrder.paraTitle;
  if (key.startsWith("paragraph")) return typeOrder.paragraph;
  if (key.startsWith("media")) return typeOrder.media;
  return Infinity; // Unknown types go last
};

const groupAndSortKeys = (keys: any[]) => {
  const grouped: GroupedKeys = {};

  // Group keys by their numeric suffix
  keys.forEach((key) => {
    const index = extractNumber(key);
    if (!grouped[index]) {
      grouped[index] = [];
    }
    grouped[index].push(key);
  });

  // Sort each group by type priority
  Object.keys(grouped).forEach((group) => {
    grouped[+group].sort((a: string, b: string) => {
      const typeA = getTypePriority(a);
      const typeB = getTypePriority(b);
      return typeA - typeB;
    });
  });

  return grouped;
};

export default function ProjectPage({
  params,
}: {
  params: { project: string };
}) {
  const [projectData, setProjectData] = useState<any>({});

  useEffect(() => {
    async function fetchProjectData() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", params.project)
        .single();
      if (error) {
        console.error("Error fetching project:", error);
        navigate("/");
        return;
      }
      if (!data || data.status.toLowerCase() === "unconfirmed") {
        console.log("Projects is null");
        navigate("/");
        return [];
      }
      if (data) {
        data.date = new Date(data.date).getFullYear().toString(); // Convert date to year only
      }

      setProjectData(data);
    }

    fetchProjectData();
  }, [params.project]);

  // Helper function to determine if the media is an image based on file extension
  const isImage = (src: string) => /\.(jpg|jpeg|png|gif)$/i.test(src);

  // Helper function to determine if the media is a video based on file extension
  const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);

  const settings = {
    dotsClass:
      "flex flex-row justify-center items-center [&>*]:transition-colors [&>*]:duration-500 [&>li>button]:text-[0] [&>li>button]:leading-[0] [&>li>button]:block [&>li>button]:w-5 [&>li>button]:h-5 [&>li>button]:p-1 [&>li>button]:cursor-pointer [&>li>button]:text-transparent [&>li>button]:border-0 [&>li>button]:outline-none [&>li>button]:bg-transparent [&>li>button]:before:font-['slick'] [&>li>button]:before:text-[6px] [&>li>button]:before:leading-5 [&>li>button]:before:text-black [&>li>button]:before:dark:text-white [&>li>button]:before:content-['•'] [&>li>button]:before:opacity-25 [&>li.slick-active>button]:before:opacity-75",
    dots: true,

    adaptiveHeight: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  // Render media with optional caption
  const renderMedia = (media: any[]) => {
    return media.map(
      (item: { src: string; alt: string; caption?: string }, index: number) => (
        <div
          key={index}
          className="flex justify-center items-center flex-wrap text-center w-full pl-px"
        >
          {isImage(item.src) ? (
            <Image
              src={item.src}
              alt={item.alt}
              width="2000"
              height="2000"
              className="w-full"
            />
          ) : isVideo(item.src) ? (
            <video controls className=" w-full max-w-full max-h-[500px]">
              <source
                src={item.src}
                type={`video/${item.src.split(".").pop()}`}
              />
              Your browser does not support the video tag.
            </video>
          ) : null}
          {item.caption && (
            <p className="transition-colors duration-500 w-full font-bold text-sm mt-2.5">
              {item.caption}
            </p>
          )}
        </div>
      )
    );
  };

  const renderMediaSection = (media: any[]) => {
    if (media.length === 1) {
      return renderMedia(media);
    } else {
      return (
        <Slider
          className="[&>.slick-list]:transition-[height] [&>.slick-list]:duration-1000 [&>*]:transition-colors [&>*]:duration-500 [&>.slick-next]:before:content-['→'] [&>.slick-prev]:before:content-['←'] [&>.slick-arrow]:before:text-black [&>.slick-arrow]:before:dark:text-white"
          {...settings}
        >
          {renderMedia(media)}
        </Slider>
      );
    }
  };

  const renderContent = () => {
    const keys = Object.keys(projectData);
    const groupedAndSortedKeys = groupAndSortKeys(keys);

    // Process each group in order based on the numeric index
    return Object.keys(groupedAndSortedKeys)
      .sort((a, b) => +a - +b)
      .map((index) => {
        const groupIndex = +index; // Convert index back to number
        return groupedAndSortedKeys[groupIndex].map((key) => {
          if (key.startsWith("paraTitle")) {
            return (
              <h2 className="w-full text-3xl font-bold text-left" key={key}>
                {projectData[key]}
              </h2>
            );
          } else if (key.startsWith("paragraph")) {
            return (
              <p className="w-full text-left" key={key}>
                {parseText(projectData[key])}
              </p>
            );
          } else if (
            key.startsWith("media") &&
            Array.isArray(projectData[key]) &&
            projectData[key].length > 0
          ) {
            return (
              <div key={key} className="max-w-[90vw] sm:max-w-full sm:w-full">
                {renderMediaSection(projectData[key])}
              </div>
            );
          }
          return null;
        });
      });
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const arrowVariants = {
    animate: {
      y: [0, 20, 0],
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatDirection: "reverse",
        repeatDelay: 1,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="dark:bg-gray-800 bg-white transition-colors duration-500 dark:text-gray-200 text-gray-700">
      <div className="relative w-full h-[75vh]">
        <Image
          src={projectData.titleImageUrl}
          alt={projectData.title}
          width={5000}
          height={5000}
          className="w-full h-full object-cover"
        />
        <div className="absolute transition-all duration-1000 inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-800"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
          <div className="sm:flex sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col justify-between items-center sm:items-start">
              <h1 className="text-4xl font-bold pb-2">{projectData.title}</h1>
              <p>{projectData.description}</p>
            </div>
            <div className="flex flex-col  justify-between items-center">
              <p className="text-md capitalize w-fit px-4 py-px my-2 rounded-2xl border-2 text-gray-200 dark:text-gray-700 border-blue-600 bg-blue-600 dark:bg-yellow-200 dark:border-yellow-200">
                {projectData.status}
              </p>
              <p className="text-lg capitalize">{projectData.date}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Animated arrow */}
      <div className="flex justify-center items-center">
        <motion.div
          className="flex flex-col justify-center items-center pt-5 cursor-pointer"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          onClick={() => {
            const section = document.querySelector(".content-section");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            } else {
              console.error('No element with class "content-section" found.');
            }
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-down"
              variants={arrowVariants}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </motion.svg>
          ))}
        </motion.div>
      </div>
      <div className="flex flex-col items-center justify-center min-w-full pt-[10%] px-4 gap-4 md:px-[15%] content-section ">
        {renderContent()}
      </div>
    </div>
  );
}
