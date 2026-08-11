"use client";

import { motion, useInView, MotionConfig } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <motion.span
        aria-hidden
        className="block overflow-hidden"
      >
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: EASE, delay }}
        >
          {children}
        </motion.span>
      </motion.span>
    </span>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s` }}
    >
      {children}
    </div>
  );
}
