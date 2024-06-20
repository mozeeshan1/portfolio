import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/supabase/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import LoadingCircle from "@/components/loadingIcon";

interface PasswordModalProps {
  slug: string;
  prefilledPassword: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  slug,
  prefilledPassword,
}) => {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [password, setPassword] = useState(prefilledPassword);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    // Automatically focus the input when the component is mounted
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Fetch project name on mount
    const fetchProjectName = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("title")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching project name:", error);
      } else {
        setProjectName(data.title);
      }
    };

    fetchProjectName();
  }, [slug]);

  const redirect = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const newMetadata = user.user_metadata.unconfirmedProjects || [];
    newMetadata.push(slug);
    await supabase.auth.updateUser({
      data: { unconfirmedProjects: newMetadata },
    });
    const session = localStorage.getItem("supabase.auth.token") || "";
    const parsedSession = JSON.parse(session).session;
    const { data } = await supabase.auth.refreshSession(parsedSession);
    localStorage.setItem("supabase.auth.token", JSON.stringify(data));
    router.push(`/projects/${slug}`);
  }, [slug, router]);

  const submitPassword = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://password-auth.secourk.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug, password }),
        }
      );

      if (response.ok) {
        setAccessGranted(true);
        setTimeout(() => {
          redirect();
        }, 2000); // Wait for 2 seconds to show the message
      } else {
        setAccessDenied(true);
        setTimeout(() => {
          setLoading(false);
          setAccessDenied(false);
        }, 600);
      }
    } catch (error) {
      console.error("Error submitting password:", error);
      setLoading(false);
      setAccessDenied(true);
      setTimeout(() => {
        setAccessDenied(false);
      }, 600); // Shake duration
    }
  }, [password, redirect, slug]);

  const close = useCallback(() => {
    if (!loading && !accessGranted) {
      router.push(`/`, { scroll: false });
    }
  }, [loading, accessGranted, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !loading) {
        submitPassword();
      }
    },
    [loading, submitPassword]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalAnimations = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    deny: {
      x: [0, -50, 50, -50, 0],
      scale: 1,
      transition: { ease: "easeInOut", duration: 0.5 },
    }, // Shake effect
  };
  return (
    <motion.div
      className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className=" max-w-[90vw] text-center rounded-lg bg-gray-200 dark:bg-gray-700"
        variants={modalAnimations}
        initial="initial"
        animate={accessDenied ? "deny" : "animate"}
        exit="exit"
      >
        {!accessGranted ? (
          <div className="flex flex-col justify-center items-center gap-4 py-8 min-w-[90vw] sm:min-w-0 sm:px-16">
            <motion.h2
              initial={false}
              animate={
                accessDenied
                  ? {
                      color: "red",
                      transition: { ease: "easeInOut", duration: 2 },
                    }
                  : {}
              }
              className="max-w-[90%] sm:max-w-[none] "
            >
              Input password for{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={projectName || "default"}
                  className="lowercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ ease: "easeInOut" }}
                >
                  {projectName || "the project"}
                </motion.span>
              </AnimatePresence>
            </motion.h2>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              className="mt-4 w-full px-4 py-2 rounded-lg max-w-[80%] sm:max-w-[none]"
            />
            <div className="flex w-full justify-between items-center mt-8 max-w-[80%] sm:max-w-[none]">
              <button onClick={close}>Close</button>
              <button
                onClick={submitPassword}
                className="rounded-lg px-5 py-2 bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between items-center w-full gap-8 h-full py-8 min-w-[90vw] sm:min-w-0 sm:px-16">
            <h1 className="text-4xl text-blue-600 dark:text-yellow-200">
              Access Granted
            </h1>
            <div className="flex flex-col justify-center items-center gap-4">
              <p>Loading Project...</p>
              <LoadingCircle />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
export default PasswordModal;
