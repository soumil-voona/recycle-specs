import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ScrollAnimation = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  distance = 50,
  className = '' 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      case 'scale': return { scale: 0.8, opacity: 0 };
      case 'fade': return { opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  const getAnimateTransform = () => {
    switch (direction) {
      case 'scale': return { scale: 1, opacity: 1 };
      case 'fade': return { opacity: 1 };
      default: return { x: 0, y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialTransform()}
      animate={isInView ? getAnimateTransform() : getInitialTransform()}
      transition={{
        duration,
        delay,
        ease: [0.4, 0.0, 0.2, 1], // Custom cubic bezier for smooth feel
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;