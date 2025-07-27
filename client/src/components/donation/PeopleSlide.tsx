import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { DonationImpact } from "@/types/donation";
import SlideLayout from "./SlideLayout";
import { Users } from "lucide-react";
import CountUpAnimation from "./CountUpAnimation";

interface PeopleSlideProps {
  impact: DonationImpact;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstSlide?: boolean;
  isLastSlide?: boolean;
}

export default function PeopleSlide({ 
  impact,
  onNext,
  onPrevious,
  isFirstSlide,
  isLastSlide 
}: PeopleSlideProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const peopleRef = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  useEffect(() => {
    const controls = animate(count, impact.peopleServed, {
      duration: 2,
      ease: "easeOut"
    });
    
    return () => controls.stop();
  }, [count, impact.peopleServed]);

  // Animation for the people visualization dots
  useEffect(() => {
    // Animate the people counter with growing dots
    if (peopleRef.current) {
      const animation = peopleRef.current.animate(
        [{ width: '0%' }, { width: '90%' }],
        {
          duration: 2000,
          fill: 'forwards',
          easing: 'ease-out',
        }
      );

      animation.onfinish = () => setAnimationComplete(true);

      return () => {
        animation.cancel();
      };
    }
  }, []);
  
  // Calculate how many dots to show - don't show too many
  const numberOfDots = Math.min(100, impact.peopleServed);
  
  // Container and item variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.6
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <SlideLayout
      title="You Helped Serve"
      variant="people"
      quote="Real people, real stories, real hope."
      onNext={onNext}
      onPrevious={onPrevious}
      isFirstSlide={isFirstSlide}
      isLastSlide={isLastSlide}
    >
      <div className="flex flex-col items-center space-y-5 relative">
        {/* Floating hearts and sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-15, 15, -15],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
            >
              {i % 3 === 0 ? "💚" : i % 3 === 1 ? "✨" : "🤗"}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.3 
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Users className="h-16 w-16 text-[#0c4428] mb-3" />
          </motion.div>
        </motion.div>
        
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 200 }}
          >
            <p className="text-6xl sm:text-7xl md:text-8xl font-bold text-[#0c4428] mb-4">
              <motion.span
                animate={{ 
                  color: ["#0c4428", "#227d7f", "#0c4428"],
                  textShadow: [
                    "0 0 0 transparent",
                    "0 0 30px rgba(34, 125, 127, 0.4)",
                    "0 0 0 transparent"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                {rounded}
              </motion.span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            <p className="text-2xl sm:text-3xl font-semibold text-[#414042]">People Served</p>
          </motion.div>
        </div>
        
        {/* People visualization */}
        <motion.div 
          className="w-full h-16 bg-gradient-to-r from-[#f0f9f4] via-[#e8f5e8] to-[#f0f9f4] rounded-lg mb-4 relative overflow-hidden border border-[#0c4428]/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div 
            ref={peopleRef} 
            className="h-16 rounded-lg flex items-center justify-start overflow-hidden"
            style={{ width: '0%' }}
          >
            <div className="flex flex-wrap p-2">
              {Array.from({ length: numberOfDots }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full mx-1 my-1 bg-[#0c4428]"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.01 * i + 1.5,
                    type: "spring",
                    stiffness: 400
                  }}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
            </div>
          </div>
          
          {/* Sparkle effect overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(45deg, transparent 0%, rgba(34, 125, 127, 0.1) 50%, transparent 100%)",
                "linear-gradient(45deg, transparent 50%, rgba(34, 125, 127, 0.2) 100%, transparent 150%)",
                "linear-gradient(45deg, transparent 100%, rgba(34, 125, 127, 0.1) 150%, transparent 200%)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
        </motion.div>
        
        <motion.div
          className="text-center mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          <p className="text-[#414042] text-sm">
            Each dot represents people you've helped in Boulder & Broomfield
          </p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex flex-col items-center p-3 sm:p-4 rounded-lg bg-[#f3ffd7] border border-[#8dc53e]/20 shadow-sm hover:shadow-md transition-shadow"
            variants={itemVariants}
          >
            <p className="text-sm font-medium text-[#414042]">Meals Provided</p>
            <p className="text-lg sm:text-xl font-semibold text-[#414042]">
              <CountUpAnimation value={impact.mealsProvided} duration={2} />
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-3 sm:p-4 rounded-lg bg-[#e7f4f2] border border-[#227d7f]/20 shadow-sm hover:shadow-md transition-shadow"
            variants={itemVariants}
          >
            <p className="text-sm font-medium text-[#414042]">Days of Food</p>
            <p className="text-lg sm:text-xl font-semibold text-[#414042]">
              {impact.daysFed}
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-3 sm:p-4 rounded-lg bg-[#f0f9f4] border border-[#0c4428]/20 shadow-sm hover:shadow-md transition-shadow"
            variants={itemVariants}
          >
            <p className="text-sm font-medium text-[#414042]">Pounds of Food</p>
            <p className="text-lg sm:text-xl font-semibold text-[#414042]">
              <CountUpAnimation value={parseInt(impact.foodRescued.toFixed(0))} duration={2} />
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-[#f0f9f4] p-4 rounded-lg border border-[#0c4428]/10 w-full mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-center text-[#0c4428] font-medium">
            Building a hunger-free community, one person at a time
          </p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}
