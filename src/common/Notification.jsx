import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "../assets/navbar_logo.svg";

const positions = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const typeStyles = {
  success: "border-l-4 border-green-500 bg-green-100/90",
  error: "border-l-4 border-red-500 bg-red-100",
  info: "border-l-4 border-blue-500 bg-blue-100/90",
};

export default function Notification({
  title,
  message,
  onClose,
  position = "bottom-right",
  type = "info",
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed z-50 ${positions[position]} ${
        typeStyles[type]
      } p-5 shadow-2xl max-w-sm rounded-xl border border-black/5`}
      initial={{ opacity: 0, x: 120 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-black"
      >
        ×
      </button>
      <div className="flex items-start gap-3">
        <img src={Logo} alt="logo" className="w-8 h-8 rounded" />
        <div>
          <h5 className="font-semibold text-gray-800 mb-0.1">{title}</h5>
          <p className="text-xs text-gray-700">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
