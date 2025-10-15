import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hoverable = true }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : {}}
      className={`bg-glass-white backdrop-blur-lg border border-glass-border rounded-2xl shadow-glass ${className}`}
    >
      {children}
    </motion.div>
  );
};
