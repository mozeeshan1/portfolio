import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
import Image from "next/image";
import * as motion from "../libraries/motion-lib";
// import projectsData from "../data/projects.json";
import websiteData from "../data/website-data.json";
import supabase from "../supabase/supabaseClient";

async function Projects() {
  let { data: projects, error } = await supabase.from("projects").select("*");

  if (!projects){
    console.log("Projects is null");
    return []
  }
  if (error) {
    console.error("Error fetching projects:", error);
    return []; // Return an empty array or handle the error as needed
  }
  return projects;
}

export default async function Home() {
  const projectsData = await Projects();

  console.log("projects data here : ", projectsData);

  // console.log("supabase here ", supabase)
  // Variants for container animation
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.3, duration: 0.5 },
    },
  };

  // Variants for child elements
  const childVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { ease: "easeInOut", duration: 0.6 },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)", // More prominent shadow on hover
      transition: { duration: 0.3 }, // Transition speed
    },
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center text-gray-800 dark:bg-gray-800 bg-white transition-colors duration-500 dark:text-white text-gray-800r " // Added top padding (pt-16)
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-4xl font-bold mb-6" variants={childVariants}>
        Welcome to My Portfolio
      </motion.h1>
      <motion.p className="mb-4" variants={childVariants}>
        Explore my work and projects.
      </motion.p>
      <motion.div className="mb-8" variants={childVariants}>
        <Image
          src="https://mozeeshan.s3.eu-west-2.amazonaws.com/About-Picture.jpg" // Replace with your profile image path
          alt="Profile Image"
          width={180}
          height={180}
          className="rounded-full"
        />
      </motion.div>
      <motion.a
        href="#projects"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        variants={childVariants}
      >
        View Projects
      </motion.a>
      {/* About Me Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-4">About Me</h2>
        <p>{websiteData.shortAboutMe}</p>
      </section>

      {/* Projects Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-4">Projects</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-24"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              className="p-4 shadow-lg rounded-lg cursor-pointer"
              variants={childVariants}
              whileHover={"hover"}
            >
              <h3 className="text-2xl font-semibold">{project.title}</h3>
              <p className="pb-2">{project.description}</p>
              <Image
                src={project.titleImageUrl}
                alt={project.title}
                width={300}
                height={200}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
