"use client";

// src/app/projects/[project]/page.tsx
import React, { useEffect, useState } from "react";
import supabase from "../../../supabase/supabaseClient";
import { motion } from "framer-motion";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "../../../styles/slick-custom-theme.css";  // Adjust the path according to your project structure
// import "../../../styles/slick/_slick.css"; // Adjust the path according to your project structure
// import "../../../styles/slick/_slick-theme.css";

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
      if (!data) {
        console.log("Projects is null");
        return [];
      }
      if (error) {
        console.error("Error fetching project:", error);
        return;
      }

      setProjectData(data);
    }

    fetchProjectData();
  }, [params.project]);
  useEffect(() => {
    console.log("project data here ", projectData);
  }, [projectData]);

  // Helper function to determine if the media is an image based on file extension
  const isImage = (src: string) => /\.(jpg|jpeg|png|gif)$/i.test(src);

  // Helper function to determine if the media is a video based on file extension
  const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);

  const settings = {
    adaptiveHeight: true,
    dots: true,
    dotsClass:
      "flex flex-row justify-center items-center [&>*]:transition-colors [&>*]:duration-500 [&>li>button]:text-[0] [&>li>button]:leading-[0] [&>li>button]:block [&>li>button]:w-5 [&>li>button]:h-5 [&>li>button]:p-1 [&>li>button]:cursor-pointer [&>li>button]:text-transparent [&>li>button]:border-0 [&>li>button]:outline-none [&>li>button]:bg-transparent [&>li>button]:before:font-['slick'] [&>li>button]:before:text-[6px] [&>li>button]:before:leading-5 [&>li>button]:before:text-black [&>li>button]:before:dark:text-white [&>li>button]:before:content-['•'] [&>li>button]:before:opacity-25 [&>li.slick-active>button]:before:opacity-75",
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    lazyLoad: "progressive" as "progressive",
    pauseOnFocus: true,
  };

  // Render media with optional caption
  const renderMedia = (media: any[]) => {
    return media.map(
      (item: { src: string; alt: string; caption?: string }, index: number) => (
        <div
          key={index}
          className="flex justify-center items-center flex-wrap text-center"
        >
          {isImage(item.src) ? (
            <Image
              src={item.src}
              alt={item.alt}
              width="500"
              height="500"
              layout="responsive"
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
            <p className="transition-colors duration-500  w-full font-bold text-sm mt-2.5">
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
          className="[&>*]:transition-colors [&>*]:duration-500 [&>.slick-next]:before:content-['→'] [&>.slick-prev]:before:content-['←'] [&>.slick-arrow]:before:text-black [&>.slick-arrow]:before:dark:text-white"
          {...settings}
        >
          {renderMedia(media)}
        </Slider>
      );
    }
  };

  return (
    <div className="dark:bg-gray-800 bg-white transition-colors duration-75 dark:text-white text-gray-800">
      <div className="relative w-full h-[75vh]">
        <Image
          src={projectData.titleImageUrl}
          alt={projectData.title}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute transition-all duration-1000 inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-800"></div>
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <h1 className="text-4xl font-bold">{projectData.title}</h1>
          <p>{projectData.description}</p>
        </div>
      </div>

      {/* <div className="flex flex-col justify-items items-center">
        <h1>Project page {projectData.slug} here</h1>
        <h1>{projectData.title}</h1>
        <p>{projectData.description}</p>
      </div> */}
      {/* Additional content can be added here */}
      {/* Animated arrow */}
      <motion.div
        className="flex justify-center pt-5 cursor-pointer"
        initial={{ y: 0 }}
        animate={{ y:50 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.8,
        }}
        onClick={() => {
          const section = document.querySelector(".content-section");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          } else {
            console.error('No element with class "content-section" found.');
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-chevron-down"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </motion.div>
      <div className="flex flex-col items-center justify-center min-w-full px-[15%] pt-[10%] content-section">
        {Object.keys(projectData).map((key) => {
          if (key.startsWith("paraTitle")) {
            return <h2 key={key}>{projectData[key]}</h2>;
          } else if (key.startsWith("paragraph")) {
            return <p key={key}>{projectData[key]}</p>;
          } else if (
            key.startsWith("media") &&
            Array.isArray(projectData[key]) &&
            projectData[key].length > 0
          ) {
            return (
              <div key={key} className="w-1/2">
                <h2>{key.replace("media", "Media ")}</h2>
                {renderMediaSection(projectData[key])}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}


export const runtime = 'edge' // 'nodejs' (default) | 'edge'