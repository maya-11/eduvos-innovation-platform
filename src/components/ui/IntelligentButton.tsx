// src/components/ui/IntelligentButton.tsx - UPDATED
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface IntelligentButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ai';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const IntelligentButton = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  className = ''
}: IntelligentButtonProps): React.ReactElement => { // FIX: Changed return type to React.ReactElement
  const baseStyles = `
    px-6 py-3 rounded-xl font-semibold
    transition-all duration-300
    backdrop-blur-sm border
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-eduvos-electric to-eduvos-innovation
      border-transparent text-white
      shadow-lg hover:shadow-xl
      hover:scale-105
    `,
    secondary: `
      bg-glass-white border-glass-border
      text-eduvos-deep dark:text-white
      hover:bg-glass-dark
    `,
    ai: `
      bg-gradient-to-r from-eduvos-innovation to-purple-600
      border-transparent text-white
      animate-neural-glow
      hover:scale-105
    `
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </motion.button>
  );
};