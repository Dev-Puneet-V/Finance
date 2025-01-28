import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg rounded-2xl bg-gray-800 p-6 shadow-xl"
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 text-gray-300">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
