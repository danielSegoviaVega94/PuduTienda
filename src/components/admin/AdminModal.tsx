import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}

export default function AdminModal({ isOpen, onClose, title, children, wide }: AdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`bg-white rounded-2xl shadow-2xl pointer-events-auto w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] flex flex-col`}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-display font-semibold text-lg text-pudu-earth">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
