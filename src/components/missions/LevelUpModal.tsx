import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function LevelUpModal({ show, level, onClose }: { show: boolean; level: number; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[var(--ink-900)]/70 z-[80] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] text-white px-10 py-10 rounded-[32px] text-center shadow-2xl max-w-sm w-full"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-4 flex justify-center"
            >
              <Sparkles size={48} className="text-white" />
            </motion.div>
            <h2 className="text-[32px] font-bold mb-2">НИВО НАГОРЕ!</h2>
            <p className="text-[18px] opacity-95 mb-6">Достигна ниво {level}</p>
            <button
              onClick={onClose}
              className="bg-white text-[var(--accent)] font-semibold h-11 px-8 rounded-full hover:bg-white/90 transition-colors"
            >
              Продължи
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
