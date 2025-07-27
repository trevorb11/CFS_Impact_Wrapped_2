import { motion } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";
import { DonationImpact } from "@/types/donation";
import SlideLayout from "./SlideLayout";
import CountUpAnimation from "./CountUpAnimation";

interface DonorFinancialSlideProps {
  impact: DonationImpact;
  amount: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstSlide?: boolean;
  isLastSlide?: boolean;
}

export default function DonorFinancialSlide({ 
  impact,
  amount,
  onNext,
  onPrevious,
  isFirstSlide,
  isLastSlide
}: DonorFinancialSlideProps) {
  
  // Container and item variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // Calculate financial metrics (leverage factor is how many times the donation is multiplied in value)
  const leverageFactor = 6; // Updated to show $1 = $6 worth of groceries
  const communityValue = amount * leverageFactor;

  return (
    <SlideLayout
      title="Financial Impact"
      variant="donor"
      quote="Your dollar works harder than you think."
      onNext={onNext}
      onPrevious={onPrevious}
      isFirstSlide={isFirstSlide}
      isLastSlide={isLastSlide}
    >
      <div className="flex flex-col items-center mb-6 relative">
        {/* Floating money and sparkle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-25, 25, -25],
                x: [-12, 12, -12],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            >
              {i % 4 === 0 ? "💰" : i % 4 === 1 ? "✨" : i % 4 === 2 ? "🏆" : "💚"}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-[#f3fae7] to-[#e8f5e8] rounded-full flex items-center justify-center mb-4 relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <DollarSign className="h-10 w-10 text-[#8dc53e]" />
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          >
            <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#8dc53e] mb-4">
              <motion.div
                animate={{ 
                  textShadow: [
                    "0 0 0 transparent",
                    "0 0 25px rgba(141, 197, 62, 0.4)",
                    "0 0 0 transparent"
                  ]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <CountUpAnimation
                  value={communityValue} 
                  isCurrency={true}
                  className="text-[#8dc53e]"
                />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-2xl sm:text-3xl font-semibold text-[#414042] mb-2">
              Community Value Created
            </p>
            <p className="text-lg text-[#414042]">
              ${amount} × {leverageFactor} = {leverageFactor}x impact
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          variants={itemVariants}
        >
          <div className="flex items-start">
            <div className="bg-[#f3fae7] p-2 rounded-full mr-3">
              <TrendingUp className="h-5 w-5 text-[#8dc53e]" />
            </div>
            <div>
              <h4 className="font-medium text-[#414042]">How Your Dollar Works</h4>
              <p className="text-sm text-gray-600">
                $1 donated = ${leverageFactor} worth of groceries through partnerships
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="mt-6 bg-[#f3fae7] p-4 rounded-lg border border-[#8dc53e]/20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <p className="text-[#414042] font-medium">
          $1 donated = ${leverageFactor} worth of nutritious groceries
        </p>
      </motion.div>
    </SlideLayout>
  );
}