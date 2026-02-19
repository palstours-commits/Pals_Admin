"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.floor(latest).toLocaleString(),
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.8,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}

export default function StatCard({ icon, label, value, iconBg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          <AnimatedNumber value={value} />
        </h2>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}
