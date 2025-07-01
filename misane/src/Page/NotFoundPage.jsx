import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Ghost, ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary px-6 text-center space-y-6">
      {/* Animated ghost icon */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="text-primary"
      >
        <Ghost size={80} strokeWidth={1.5} />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="text-4xl font-bold"
      >
        404 - Page Not Found
      </motion.h1>

      {/* Animated floating emoji */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-3xl"
      >
        😵‍💫
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-text-soft max-w-md"
      >
        Oops! The page you're looking for doesn't exist. Maybe it took a coffee
        break ☕.
      </motion.p>

      {/* Go home button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition"
      >
        <ArrowLeftCircle size={18} />
        Go Home
      </motion.button>
    </div>
  );
}
