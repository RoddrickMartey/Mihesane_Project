import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Progress({ value = 0 }) {
  const clampedValue = Math.min(Math.max(value, 0), 100); // Clamp between 0 and 100

  return (
    <div className="w-full h-4 bg-surface overflow-hidden">
      <motion.div
        className="h-full bg-secondary"
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

export default Progress;
