import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  is3D?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className, is3D = true, style }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={is3D ? { y: -5, rotateX: 2, rotateY: 2 } : {}}
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300 card-3d',
        className
      )}
      style={style}
    >
      {children}
    </motion.div>
  );
};
