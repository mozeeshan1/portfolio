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

  useEffect(() => {
    // Automatically focus the input when the component is mounted
    inputRef.current?.focus();
  }, []);

  const submitPassword = async () => {
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
        alert("Password correct! Access granted.");
        // Optionally redirect or close modal
        redirect();
      } else {
        alert("Password incorrect! Try again.");
      }
    } catch (error) {
      console.error("Error submitting password:", error);
    }
  };
  const redirect = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const newMetadata = user.user_metadata.unconfirmedProjects || [];
    newMetadata.push(slug);
    const {} = await supabase.auth.updateUser({
      data: { unconfirmedProjects: newMetadata },
    });
    const session = localStorage.getItem("supabase.auth.token") || "";
    const parsedSession = JSON.parse(session).session;

    const { data, error } = await supabase.auth.refreshSession(parsedSession);
    localStorage.setItem("supabase.auth.token", JSON.stringify(data));
    // Adjust URL to show the modal is closed
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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      submitPassword();
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
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
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <h2>Password Required for {slug}</h2>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className=" mt-4 min-h-12 px-4 rounded-2xl dark:bg-gray-200 dark:text-gray-700"
        />
        <div className="flex w-full justify-between items-center mt-8">
          <button onClick={close}>Close</button>
          <button
            onClick={submitPassword}
            className="rounded-lg min-h-12 min-w-16 px-5 py-2 bg-blue-600 text-gray-200 hover:bg-blue-700 dark:bg-yellow-200 dark:text-gray-700 dark:hover:bg-yellow-300"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default PasswordModal;
