'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export function AnimateIn({ 
  children, 
  delay = 0, 
  y = 30,
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number; 
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
