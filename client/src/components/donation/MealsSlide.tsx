import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { DonationImpact } from "@/types/donation";
import SlideLayout from "./SlideLayout";
import { SLIDE_CONFIG } from "@/lib/constants";
import { Utensils } from "lucide-react";

interface MealsSlideProps {
  impact: DonationImpact;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstSlide?: boolean;
  isLastSlide?: boolean;
}

export default function MealsSlide({ 
  impact,
  onNext,
  onPrevious,
  isFirstSlide,
  isLastSlide
}: MealsSlideProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, impact.mealsProvided, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, impact.mealsProvided]);

  return (
    <SlideLayout
      title="Your Donation Provides"
      variant="meals"
      quote="Fighting hunger, one meal at a time."
      onNext={onNext}
      onPrevious={onPrevious}
      isFirstSlide={isFirstSlide}
      isLastSlide={isLastSlide}
    >
      <div className="flex flex-col items-center space-y-5 relative">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#227d7f] opacity-10"
              style={{
                width: Math.random() * 60 + 20,
                height: Math.random() * 60 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
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
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Utensils className="h-16 w-16 text-[#227d7f] mb-3" />
          </motion.div>
        </motion.div>
        
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          >
            <p className="text-6xl sm:text-7xl md:text-8xl font-bold text-[#0c4428] mb-4">
              <motion.span
                animate={{ 
                  textShadow: [
                    "0 0 0 transparent",
                    "0 0 20px rgba(12, 68, 40, 0.3)",
                    "0 0 0 transparent"
                  ]
                }}
                transition={{
                  duration: 2,
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-2xl sm:text-3xl font-semibold text-[#414042] mb-2">Meals Provided</p>
            <p className="text-lg text-[#414042]">
              Feeds {impact.peopleFed} people for {impact.daysFed} days
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="bg-gradient-to-r from-[#f0f9f4] to-[#e8f5e8] p-4 rounded-lg border border-[#0c4428]/10 w-full mt-6 relative z-10"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.p 
            className="text-center text-[#0c4428] font-medium"
            animate={{ 
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            $1 = 1.52 meals for our community
          </motion.p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}
