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
      <div className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-20 h-20 bg-[#f3fae7] rounded-full flex items-center justify-center mb-4"
        >
          <DollarSign className="h-10 w-10 text-[#8dc53e]" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#8dc53e] mb-4">
            <CountUpAnimation
              value={communityValue} 
              isCurrency={true}
              className="text-[#8dc53e]"
            />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold text-[#414042] mb-2">
            Community Value Created
          </p>
          <p className="text-lg text-[#414042]">
            ${amount} × {leverageFactor} = {leverageFactor}x impact
          </p>
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