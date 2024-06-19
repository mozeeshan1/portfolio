import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/supabase/supabaseClient";
import { motion } from "framer-motion";

interface PasswordModalProps {
  slug: string;
  prefilledPassword: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  slug,
  prefilledPassword,
}) => {
  const router = useRouter();
  const [password, setPassword] = useState(prefilledPassword);
  // To close the modal when clicking outside
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    // Automatically focus the input when the component is mounted
    inputRef.current?.focus();
  }, []);

  // const submitPassword = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://password-auth.secourk.workers.dev/",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ slug, password }),
  //       }
  //     );

  //     if (response.ok) {
  //       alert("Password correct! Access granted.");
  //       // Optionally redirect or close modal
  //       redirect();
  //     } else {
  //       alert("Password incorrect! Try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting password:", error);
  //   }
  // };

  const submitPassword = async () => {
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
        // STOPPED HERE. IT SHOWS THE STUFF PROPERLY BUT U NEED TO ADD STUFF
      } else {
        setAccessDenied(true);
        setTimeout(() => {
          setLoading(false);
          setAccessDenied(false);
        }, 600);
      }
    } catch (error) {
      console.error("Error submitting password:", error);
      setAccessDenied(true);
      setTimeout(() => {
        setAccessDenied(false);
        setLoading(false);
      }, 600); // Shake duration
    }
  };
  const redirect = async () => {
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
  };

  const close = () => {
    // Adjust URL to show the modal is closed
    router.push(`/`, { scroll: false });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalRef]);
  const handleKeyDown = (event: React.KeyboardEvent, status: boolean) => {
    if (event.key === "Enter" && !status) {
      submitPassword();
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    console.log(loading);
  }, [loading]);
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
        className="flex flex-col justify-center items-center max-w-[90vw] text-center gap-4 pt-12 px-12 pb-6 rounded-lg bg-gray-200 dark:bg-gray-700 "
        variants={modalAnimations}
        initial="initial"
        animate={accessDenied ? "deny" : "animate"}
        exit="exit"
      >
        {!accessGranted ? (
          <>
            <h2>Password Required for {slug}</h2>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, loading)}
              className="mt-4 w-full px-4 py-2 rounded-lg"
            />
            <div className="flex w-full justify-between items-center mt-8">
              <button onClick={() => router.push(`/`)}>Close</button>
              <button
                onClick={submitPassword}
                className="rounded-lg px-5 py-2 bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>Access Granted</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
export default PasswordModal;
