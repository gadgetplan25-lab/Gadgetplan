// "use client" 

// import * as React from "react"

// import { motion } from "motion/react";

// export interface ShiningTextProps {
//   text: string;
//   className?: string;
//   duration?: number;
// }

// export function ShiningText({ text, className, duration = 2 }: ShiningTextProps) {
//   return (
//     <motion.h1
//       className={`bg-[linear-gradient(110deg,#002B50,35%,#FDFEFF,50%,#002B50,75%,#002B50)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${className || ''}`}
//       initial={{ backgroundPosition: "200% 0" }}
//       animate={{ backgroundPosition: "-200% 0" }}
//       transition={{
//         repeat: Infinity,
//         duration: duration,
//         ease: "linear",
//       }}
//     >
//       {text}
//     </motion.h1>
//   );
// }

"use client";
import React from "react";

const ShiningText = ({ text, className = "", duration = 3 }) => {
  return (
    <span
      className={`bg-[linear-gradient(110deg,#002B50,35%,#FDFEFF,50%,#002B50,75%,#002B50)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${className || ''}`}
      style={{
        backgroundSize: "200% auto",
        animation: `shine ${duration}s linear infinite`,
      }}
      transition={{
        repeat: Infinity,
        duration: duration,
        ease: "linear",
      }}
    > 
      {text}
      <style jsx>{`
        @keyframes shine {
          to {
            background-position: -200% center;
          }
        }
      `}</style>
    </span>
  );
};

export default ShiningText;
