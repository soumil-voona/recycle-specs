import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Home from './sections/Home'
import Navbar from './sections/Navbar'
import BoardMembers from './sections/BoardMembers'
import AboutUs from './sections/AboutUs'
import Partnerships from './sections/Partnerships'

// Animation variants for different section types
const sectionVariants = {
  hidden: { 
    opacity: 0,
    y: 100,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
      staggerChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 1.05,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
}

const alternateVariants = {
  hidden: { 
    opacity: 0,
    x: -100,
    rotateY: -15
  },
  visible: { 
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 1,
      ease: 'easeOut',
      staggerChildren: 0.15
    }
  }
}

const slideFromRightVariants = {
  hidden: { 
    opacity: 0,
    x: 100,
    scale: 0.9
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1], // Smooth spring easing
      staggerChildren: 0.1
    }
  }
}

// Wrapper component for scroll-triggered animations
const AnimatedSection = ({ children, variants = sectionVariants, className = "", id, triggerAmount = 0.2 }) => {
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isInView = useInView(ref, { 
    once: true,
    amount: triggerAmount, // Use prop for trigger amount
    margin: "0px 0px -50px 0px" // Less aggressive margin
  })

  // Reset animation state when element goes completely out of view
  useEffect(() => {
    if (!isInView && hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(false)
      }, 500) // Small delay to prevent immediate re-trigger
      return () => clearTimeout(timer)
    }
  }, [isInView, hasAnimated])

  // Only animate when coming into view for the first time after being reset
  const shouldAnimate = isInView && !hasAnimated

  if (shouldAnimate && !hasAnimated) {
    setHasAnimated(true)
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      animate={shouldAnimate || hasAnimated ? "visible" : "hidden"}
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  )
}

// Special wrapper for the home section with different behavior
const HomeSection = ({ children }) => {
  return (
    <motion.div
      id="home"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <>
      <Navbar />
      
      {/* Global page transition wrapper */}
      <motion.div 
        style={{ paddingTop: "70px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Home Section - Always visible first */}
        <HomeSection>
          <Home />
        </HomeSection>

        {/* About Us Section - Slide from left */}
        <AnimatedSection 
          id="about" 
          variants={alternateVariants}
        >
          <AboutUs />
        </AnimatedSection>

        {/* Board Members Section - Default animation */}
        <AnimatedSection 
          id="board" 
          variants={sectionVariants}
          triggerAmount={0.01} // Trigger as soon as section enters viewport
        >
          <BoardMembers />
        </AnimatedSection>

        {/* Partnerships Section - Slide from right */}
        <AnimatedSection 
          id="partnerships" 
          variants={slideFromRightVariants}
        >
          <Partnerships />
        </AnimatedSection>

        {/* Contact Section - Future placeholder with animation ready */}
        <AnimatedSection 
          id="contact" 
          variants={sectionVariants}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, ease: 'easeOut' }
              }
            }}
            style={{
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(45, 125, 125, 0.1), rgba(196, 93, 7, 0.1))',
              margin: '4rem 0',
              borderRadius: '2rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: { 
                  scale: 1, 
                  opacity: 1,
                  transition: { delay: 0.2, duration: 0.5 }
                }
              }}
              style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#2d2d2d'
              }}
            >
              <h2 style={{
                fontFamily: "'DM Serif Text', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                marginBottom: '1rem',
                fontWeight: 700
              }}>
                Contact Us
              </h2>
              <p style={{
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '1.1rem',
                opacity: 0.8,
                maxWidth: '600px'
              }}>
                Ready to make a difference? Get in touch with our team to learn more about RecycleSpecs and how you can help bring optical care to communities in need.
                <br />
                <br />
                Email us at <br /><a href="mailto:recyclespecs@gmail.com" style={{ color: '#c65d07' }}>recyclespecs@gmail.com</a>
              </p>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </motion.div>

      {/* Page-level background animations */}
      <style jsx global>{`
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Ensure sections have proper spacing for animations */
        body {
          overflow-x: hidden; /* Prevent horizontal scrolling from animations */
        }
        
        /* Add subtle entrance animation to page elements */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Custom scrollbar styling to match the theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #e67309, #ffcc00);
        }
      `}</style>
    </>
  )
}

export default App