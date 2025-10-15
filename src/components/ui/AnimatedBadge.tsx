import { motion } from 'framer-motion';

export const AnimatedBadge = ({ text, type }) => {
  const typeStyles = {
    success: 'bg-eduvos-success/20 text-eduvos-success border-eduvos-success/30',
    warning: 'bg-eduvos-warm/20 text-eduvos-warm border-eduvos-warm/30',
    ai: 'bg-eduvos-innovation/20 text-eduvos-innovation border-eduvos-innovation/30',
    info: 'bg-eduvos-electric/20 text-eduvos-electric border-eduvos-electric/30'
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${typeStyles[type]}`}
    >
      {text}
    </motion.span>
  );
};
