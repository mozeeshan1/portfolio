import { motion } from "framer-motion";

export default function LoadingCircle() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <motion.circle
        cx="24"
        cy="24"
        r="20"
        className={"fill-none stroke-current stroke-[4px]"}
        strokeLinecap="round"
        initial={{
          strokeDasharray: "0 100",
          strokeDashoffset: "100",
        }}
        animate={{
          strokeDasharray: ["100 100", "100 100"],
          strokeDashoffset: [100, -100],
          rotate: [0, 360],
          transition: {
            duration: 2,
            ease: "linear",
            repeatType: "loop",
            repeat: Infinity,
          },
        }}
      />
    </svg>
  );
}
