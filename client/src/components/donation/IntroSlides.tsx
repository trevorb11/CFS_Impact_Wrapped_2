import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSlidesProps {
  donorFirstName?: string;
  onComplete: () => void;
}

export default function IntroSlides({ donorFirstName, onComplete }: IntroSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    if (isComplete) return;

    const timer = setTimeout(() => {
      if (currentSlide < 2) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setIsComplete(true);
        // Small delay before transitioning to main presentation
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 4500); // 4.5 seconds per slide

    return () => clearTimeout(timer);
  }, [currentSlide, isComplete, onComplete]);

  const slides = [
    {
      text: `${donorFirstName ? `${donorFirstName}, w` : "W"}elcome to your Fiscal Year 2025 Impact Wrapped`,
      bgColor: "bg-gradient-to-br from-[#0c4428] via-[#227d7f] to-[#00d6dd]", // Dark Green to Teal to Light Blue
      textColor: "text-white",
      delay: 0.3
    },
    {
      text: "See The Direct Impact You Made In Our Community",
      bgColor: "bg-gradient-to-br from-[#227d7f] via-[#8dc53e] to-[#0c4428]", // Teal to Bright Green to Dark Green
      textColor: "text-white",
      delay: 0.5
    },
    {
      text: "Thank you for your dedication to feeding our neighbors",
      bgColor: "bg-gradient-to-br from-[#8dc53e] via-[#efeb03] to-[#227d7f]", // Bright Green to Yellow to Teal
      textColor: "text-white", 
      delay: 0.7
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.8 },
        scale: { type: "spring", stiffness: 400, damping: 25 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 }
      }
    })
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 1.1,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  if (isComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={currentSlide}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={`absolute inset-0 flex items-center justify-center ${slides[currentSlide].bgColor}`}
        >
          {/* Background animated elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating circles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-10"
                style={{
                  width: Math.random() * 100 + 20,
                  height: Math.random() * 100 + 20,
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 40 - 20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 px-6 sm:px-8 md:px-12 max-w-4xl mx-auto text-center">
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ${slides[currentSlide].textColor} leading-tight`}>
                {slides[currentSlide].text}
              </h1>
            </motion.div>

            {/* Animated progress dots */}
            <motion.div 
              className="flex justify-center mt-12 space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {slides.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-40'
                  }`}
                  animate={{
                    scale: index === currentSlide ? [1, 1.3, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: index === currentSlide ? Infinity : 0,
                    repeatDelay: 1
                  }}
                />
              ))}
            </motion.div>

            {/* Skip button (subtle) */}
            <motion.button
              onClick={() => {
                setIsComplete(true);
                onComplete();
              }}
              className="absolute bottom-8 right-8 text-white text-sm opacity-60 hover:opacity-100 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2 }}
            >
              Skip
            </motion.button>
          </div>

          {/* Subtle sparkle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-2xl"
                style={{
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}