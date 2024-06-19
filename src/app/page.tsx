"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import supabase from "@/supabase/supabaseClient";
import Link from "next/link";
import PasswordModal from "@/components/password";
import { useRouter, useSearchParams } from "next/navigation";

interface Project {
  id: number;
  title: string;
  description: string;
  date: string; // Year as string after processing
  status: string;
  titleImageUrl: string;
  slug: string;
}

export default function Home() {
  const [projectsData, setProjectData] = useState<Project[]>([]);
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const slug = searchParams.get("slug") || "";
  const password = searchParams.get("password") || "";
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (!session) return;
    if (event === "USER_UPDATED") {
      setUserMetadata(session.user.user_metadata);
    }
  });

  useEffect(() => {
     return () => {
      // call unsubscribe to remove the callback
      data.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    async function fetchSession() {
      const session = localStorage.getItem("supabase.auth.token");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return await signInAnonymously();
      if (session) {
        const parsedSession = JSON.parse(session).session;
        const currentTime = new Date().getTime();
        // Check if the session expiry time is still in the future
        if (parsedSession && parsedSession.expires_at > currentTime / 1000) {
          return supabase.auth.setSession(parsedSession.access_token);
        }
      }
      return await signInAnonymously();
    }

    async function signInAnonymously() {
      const metadata = { unconfirmedProjects: [] };
      const { data, error } = await supabase.auth.signInAnonymously({
        options: { data: metadata },
      });
      if (error) {
        console.error("Error signing in anonymously:", error);
      } else if (data) {
        localStorage.setItem("supabase.auth.token", JSON.stringify(data));
      }
      return data;
    }
    async function fetchProjects() {
      let { data: projects, error } = await supabase
        .from("projects")
        .select("*");

      if (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
      if (projects) {
        // Process each project's date to extract the year
        projects = projects
          // .filter((project) => project.status.toLowerCase() !== "unconfirmed") // Filter out unconfirmed projects
          .map((project) => ({
            ...project,
            date: new Date(project.date).getFullYear().toString(), // Convert date to year
          })) // Sort projects from newest to oldest by year
          .sort((a, b) => b.date - a.date);
      } else {
        console.log("Projects is null");
        projects = [];
      }

      setProjectData(projects);
      return;
    }

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserMetadata(user.user_metadata);
      }
    }
    const fetchImage = async () => {
      const { data, error } = await supabase.from("projectsData").select("*");

      if (error) {
        console.error("Failed to fetch project for updating images:", error);
        return;
      }
      data.map((project) => {
        setImageUrls((prev) => ({
          ...prev,
          [project.slug]: project.titleImageUrl,
        }));
      });
    };

    fetchSession().then(() => {
      fetchProjects().then(() => {
        checkUser().then(() => {
          fetchImage();
        });
      });
    });
  }, []);

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

  const handleProjectClick = (project: Project) => {
    if (
      project.status === "unconfirmed" &&
      !userMetadata.unconfirmedProjects.includes(project.slug)
    ) {
      router.push(`/?modal=open&slug=${project.slug}`, { scroll: false });
    } else {
      router.push(`/projects/${project.slug}`);
    }
  };
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center text-gray-700 dark:bg-gray-800 bg-white transition-colors duration-500 dark:text-gray-200 "
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
                  key={index + 100}
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
          real-world applications. With a Master&apos;s in Advanced Computer
          Science from the University of Strathclyde, I excel in creating
          sophisticated algorithms that drive innovative software solutions.
          <br />
          <br />
          My expertise spans across machine learning, big data analytics, and
          developing interactive web functionalities that enhance user
          engagement and experience. My professional journey has equipped me
          with profound technical skills and an adaptive approach, allowing me
          to thrive in diverse environments—from startups like 10zyme, where I
          refined web and mobile applications for enhanced HPV detection, to Y
          Entertainment where I integrated AI and blockchain technologies.
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:px-16 2xl:px-[15%]"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {modal === "open" && (
            <PasswordModal slug={slug} prefilledPassword={password} />
          )}
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              onClick={() => handleProjectClick(project)}
              className="p-4 min-w-60 shadow-md w-fit h-fit hover:shadow-lg hover:shadow-blue-600 dark:hover:shadow-yellow-200 rounded-lg cursor-pointer dark:shadow-white "
              variants={childVariants}
              whileHover={"hover"}
            >
              <div className="flex flex-col justify-between items-center pb-2 sm:flex-row">
                <div className="flex flex-col justify-between items-center sm:items-start">
                  <h3 className="text-2xl font-semibold">{project.title}</h3>
                  <p
                    className={`pb-2 ${
                      project.status === "unconfirmed" &&
                      userMetadata &&
                      !userMetadata.unconfirmedProjects.includes(project.slug)
                        ? "blur"
                        : "blur-none"
                    }`}
                  >
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-col justify-between items-center gap-1">
                  <p className="text-md capitalize px-4 py-px rounded-2xl border-2 text-gray-200 dark:text-gray-700 border-blue-600 bg-blue-600 dark:bg-yellow-200 dark:border-yellow-200">
                    {project.status}
                  </p>
                  <p className="text-md capitalize">{project.date}</p>
                </div>
              </div>
              <Image
                src={imageUrls[project.slug] || project.titleImageUrl}
                alt={project.title}
                width={1000}
                height={1000}
                className={`w-[90vw] h-auto aspect-video object-cover  ${
                  project.status === "unconfirmed" &&
                  userMetadata &&
                  !userMetadata.unconfirmedProjects.includes(project.slug)
                    ? "blur"
                    : "blur-none"
                }`}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
