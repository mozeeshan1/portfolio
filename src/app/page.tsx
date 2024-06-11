import React from "react";
import Image from "next/image";
import * as motion from "../libraries/motion-lib";
import supabase from "../supabase/supabaseClient";
import Link from "next/link";

async function Projects() {
  let { data: projects, error } = await supabase.from("projects").select("*");

  if (!projects) {
    console.log("Projects is null");
    return [];
  }
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return projects;
}

export default async function Home() {
  const projectsData = await Projects();

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

  const arrowContainerVariants = {
    inital: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animations of children by 0.2 seconds
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
        repeatDelay: 5,
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center text-gray-700 dark:bg-gray-800 bg-white transition-colors duration-500 dark:text-gray-200 " // Added top padding (pt-16)
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section>
        <div className="h-screen w-full flex flex-col justify-center items-center gap-10 pt-16">
          <motion.h1
            className="text-4xl font-semibold text-center md:text-5xl md:mt-[15%] 2xl:mt-[5%] 2xl:text-7xl md:font-bold md:mb-6 "
            variants={childVariants}
          >
            Bridging Data Science and Software Development
          </motion.h1>
          <motion.p className="text-md text-center md:text-xl 2xl:text-3xl md:mb-4 md:px-[15%] ">
            Crafting innovative solutions with a focus on machine learning, big
            data, and interactive web experiences.
          </motion.p>
          <Link
            className="px-4 py-2 border-blue-600 text-blue-600 border-4 rounded-lg hover:bg-blue-600 hover:text-white dark:text-yellow-200 dark:border-yellow-200 dark:hover:bg-yellow-200 dark:hover:text-gray-700"
            href={"/resume.pdf"}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </Link>
          <motion.a
            href="#projects-section"
            className="px-4 py-2 border-gray-300 border-4 rounded-lg hover:bg-gray-300 hover:text-gray-700 dark:border-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-700"
            variants={childVariants}
          >
            Explore Projects
          </motion.a>
          <div className="flex justify-center items-center">
            <motion.div
              className="flex flex-col justify-center items-center"
              variants={arrowContainerVariants} // Apply the parent variants
              initial="inital"
              animate="animate"
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
                  variants={arrowVariants} // Apply the child variants
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </motion.svg>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* About Me Section */}
      <section id="about-me" className="my-12 md:px-[10%]">
        <h2 className="text-3xl mx-8 font-bold mb-4">About Me</h2>
        <p className="mx-8 ">
          Hello! I’m Mohammed Zeeshan, a seasoned Data Scientist and Software
          Developer with a robust academic background and a rich portfolio of
          real-world applications. With a Master&apos;s in Advanced Computer Science
          from the University of Strathclyde, I excel in creating sophisticated
          algorithms that drive innovative software solutions.
          <br />
          <br />
          My expertise spans across machine learning, big data analytics, and
          developing interactive web functionalities that enhance user
          engagement and experience. My professional journey has equipped me
          with profound technical skills and an adaptive approach, allowing me
          to thrive in diverse environments—from startups like 10zyme, where I
          refined web and mobile applications for enhanced HPV detection, to Y Entertainment
          where I integrated AI and blockchain technologies.
          <br />
          <br />
          In each role, I aim to merge cutting-edge technology with practical
          implementations, ensuring my developments are not only advanced but
          also user-centric and market-ready. Beyond my technical capabilities,
          I am passionate about using data to solve complex problems and deliver
          insights that inform strategic decisions.
          <br />
          <br />
          Whether it&apos;s through predictive models for the stock market or
          innovative web applications, my goal is to make technology accessible
          and useful for improving business outcomes and enhancing daily life.
          Dive into my projects to see how I apply these principles in various
          sectors, and let’s explore how we can collaborate to transform ideas
          into impactful digital solutions.
        </p>
      </section>
      {/* Projects Section */}
      <section id="projects-section" className="my-12">
        <h2 className="text-3xl font-bold mb-10 text-center">Projects</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-16 sm:px-16 2xl:px-[15%]"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {projectsData.map((project, index) => (
            <Link
              key={index}
              href={`/projects/${project.slug}`}
              className="min-w-60"
              passHref
            >
              <motion.div
                key={index}
                className="p-4 shadow-md w-fit h-fit hover:shadow-lg rounded-lg cursor-pointer dark:shadow-white "
                variants={childVariants}
                whileHover={"hover"}
              >
                <h3 className="text-2xl font-semibold">{project.title}</h3>
                <p className="pb-2">{project.description}</p>
                <Image
                  src={project.titleImageUrl}
                  alt={project.title}
                  width={1000}
                  height={1000}
                  className="w-[80vw] h-auto"
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
