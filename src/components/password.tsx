import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/supabase/supabaseClient";

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

  // To close the modal when clicking outside
  const modalRef = useRef<HTMLDivElement>(null);

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


 useEffect(() => {
   document.body.style.overflow = "hidden";
   return () => {
     document.body.style.overflow = "auto";
   };
 }, []);
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div ref={modalRef} className="flex flex-col justify-center items-center gap-4 p-12 bg-gray-700 rounded-lg">
        <h2>Password Required for {slug}</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submitPassword}>Submit</button>
        <button onClick={close}>Close</button>
      </div>
    </div>
  );
};
export default PasswordModal;
