import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { DonationImpact } from "@/types/donation";
import SlideLayout from "./SlideLayout";
import { 
  Leaf, 
  Droplet, 
  Car, 
  CloudRain, 
  Trees, 
  Trash2, 
  Recycle, 
  Wind, 
  Factory, 
  CircleDot
} from "lucide-react";
import CountUpAnimation from "./CountUpAnimation";

interface EnvironmentSlideProps {
  impact: DonationImpact;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstSlide?: boolean;
  isLastSlide?: boolean;
}

type ImpactMetric = 'co2' | 'water';

export default function EnvironmentSlide({ 
  impact, 
  onNext,
  onPrevious,
  isFirstSlide,
  isLastSlide
}: EnvironmentSlideProps) {
  // State for which environmental metric to highlight
  const [activeMetric, setActiveMetric] = useState<ImpactMetric>('co2');
  
  // Auto-rotate through metrics (slower transition time)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric(current => {
        if (current === 'co2') return 'water';
        return 'co2';
      });
    }, 9000); // Increased from 6000 to 9000 ms for slower transitions
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  // Get CO2 comparison in more relatable terms
  const getCO2Comparison = () => {
    const co2Lbs = impact.co2Saved;
    
    // Car emissions (average car emits ~4.6 tons of CO2 per year = ~9,200 lbs)
    const carsOffRoad = (co2Lbs / 9200).toFixed(1);
    
    // Trees planted (average tree absorbs ~48 lbs of CO2 per year)
    const treesPlanted = Math.round(co2Lbs / 48);
    
    // Flight distance (1 mile of flight produces ~0.5 lbs of CO2)
    const flightMiles = Math.round(co2Lbs / 0.5);
    
    return {
      carsOffRoad,
      treesPlanted,
      flightMiles
    };
  };
  
  // Get water saved comparison in more relatable terms
  const getWaterComparison = () => {
    const waterGal = impact.waterSaved;
    
    // Bathtubs (average bath uses ~30 gallons)
    const bathtubs = Math.round(waterGal / 30);
    
    // Showers (average 8-minute shower uses ~20 gallons)
    const showers = Math.round(waterGal / 20);
    
    // Olympic swimming pools (660,000 gallons)
    const swimmingPools = (waterGal / 660000).toFixed(3);
    
    return {
      bathtubs,
      showers,
      swimmingPools
    };
  };
  
  const comparisons = {
    co2: getCO2Comparison(),
    water: getWaterComparison()
  };
  
  // Animation for particles
  const particleAnimation = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0.4, 0.8, 0.4],
      scale: [0.8, 1.2, 0.8],
      y: [0, -10, 0],
      transition: {
        delay: i * 0.2,
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
      }
    })
  };
  
  return (
    <SlideLayout
      title="Your Environmental Impact"
      variant="environment"
      quote="Fighting hunger and climate change together."
      onNext={onNext}
      onPrevious={onPrevious}
      isFirstSlide={isFirstSlide}
      isLastSlide={isLastSlide}
      useFullPage={true}
    >
      <div className="flex flex-col items-center space-y-5">
        {/* Environmental impact icon with animated effects */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 0.3 
            }}
            className="relative"
          >
            <Leaf className="h-16 w-16 text-[#8dc53e] mb-3" />
            
            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${i * 10 - 20}%`,
                  left: `${i % 2 === 0 ? -20 - i * 5 : 100 + i * 5}%`,
                  width: `${8 - i}px`,
                  height: `${8 - i}px`
                }}
                custom={i}
                variants={particleAnimation}
                initial="hidden"
                animate="visible"
              >
                <CircleDot className={`text-${i % 2 === 0 ? '[#8dc53e]' : '[#227d7f]'}`}/>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Animated impact headline */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-2xl sm:text-3xl font-semibold text-[#414042] mb-2">Environmental Impact</p>
          <p className="text-lg text-[#414042]">
            By rescuing {impact.foodRescued.toLocaleString()} pounds of food
          </p>
        </motion.div>
        
        {/* Environmental metrics tabs - Waste Reduction tab removed */}
        <div className="flex justify-center space-x-4 w-full">
          <motion.button
            className={`px-4 py-2 rounded-full text-sm ${
              activeMetric === 'co2' 
                ? 'bg-[#8dc53e] text-white font-medium' 
                : 'bg-[#8dc53e]/10 text-[#414042] hover:bg-[#8dc53e]/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveMetric('co2')}
          >
            <div className="flex items-center">
              <Recycle className="h-4 w-4 mr-1" />
              <span>CO₂e Prevented</span>
            </div>
          </motion.button>
          
          <motion.button
            className={`px-4 py-2 rounded-full text-sm ${
              activeMetric === 'water' 
                ? 'bg-[#227d7f] text-white font-medium' 
                : 'bg-[#227d7f]/10 text-[#414042] hover:bg-[#227d7f]/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveMetric('water')}
          >
            <div className="flex items-center">
              <Droplet className="h-4 w-4 mr-1" />
              <span>Water Saved</span>
            </div>
          </motion.button>
        </div>
        
        {/* Environmental impact visualization - animated card that changes with tabs */}
        <AnimatePresence mode="wait">
          {activeMetric === 'co2' && (
            <motion.div
              key="co2"
              className="bg-[#f3ffd7] p-5 sm:p-6 rounded-lg border border-[#8dc53e]/20 shadow-md w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-3">
                  <Recycle className="h-10 w-10 text-[#8dc53e] mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-[#414042]">CO₂e Emissions Prevented</h3>
                    <p className="text-sm text-[#414042]">8.65 pounds saved per pound of food rescued</p>
                  </div>
                </div>
                
                <motion.div 
                  className="bg-gradient-to-br from-white/90 to-white/70 rounded-lg p-4 w-full mb-4 relative overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                >
                  {/* Floating background elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-[#8dc53e] opacity-10"
                        style={{
                          width: Math.random() * 40 + 15,
                          height: Math.random() * 40 + 15,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [-15, 15, -15],
                          x: [-8, 8, -8],
                          rotate: [0, 180, 360],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 6 + Math.random() * 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-end justify-center relative z-10">
                    <motion.div
                      animate={{ 
                        textShadow: [
                          "0 0 0 transparent",
                          "0 0 25px rgba(141, 197, 62, 0.4)",
                          "0 0 0 transparent"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                      <CountUpAnimation 
                        value={impact.co2Saved} 
                        duration={2} 
                        className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#8dc53e]"
                      />
                    </motion.div>
                    <motion.span 
                      className="text-3xl sm:text-4xl font-semibold text-[#8dc53e] ml-2"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      lbs
                    </motion.span>
                  </div>
                  <p className="text-center text-lg font-semibold text-[#414042] mt-2 relative z-10">CO₂ Prevented</p>
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <div className="bg-white/50 p-3 rounded-lg text-center shadow-sm">
                    <Car className="h-6 w-6 text-[#414042] mx-auto mb-1" />
                    <p className="font-medium text-[#414042]">{comparisons.co2.carsOffRoad}</p>
                    <p className="text-xs">cars off the road for a year</p>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-lg text-center shadow-sm">
                    <Trees className="h-6 w-6 text-[#8dc53e] mx-auto mb-1" />
                    <p className="font-medium text-[#414042]">{comparisons.co2.treesPlanted}</p>
                    <p className="text-xs">trees planted and grown for a year</p>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-lg text-center shadow-sm">
                    <Wind className="h-6 w-6 text-[#227d7f] mx-auto mb-1" />
                    <p className="font-medium text-[#414042]">{comparisons.co2.flightMiles}</p>
                    <p className="text-xs">miles of air travel emissions</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeMetric === 'water' && (
            <motion.div
              key="water"
              className="bg-[#e7f4f2] p-5 sm:p-6 rounded-lg border border-[#227d7f]/20 shadow-md w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-3">
                  <CloudRain className="h-10 w-10 text-[#227d7f] mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-[#414042]">Water Resources Saved</h3>
                    <p className="text-sm text-[#414042]">By preventing food production waste</p>
                  </div>
                </div>
                
                <div className="bg-white/70 rounded-lg p-4 w-full mb-4">
                  <div className="flex items-end justify-center">
                    <CountUpAnimation 
                      value={impact.waterSaved} 
                      duration={2} 
                      className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#227d7f]"
                    />
                    <span className="text-3xl sm:text-4xl font-semibold text-[#227d7f] ml-2">gallons</span>
                  </div>
                  <p className="text-center text-lg font-semibold text-[#414042] mt-2">Water Saved</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <div className="bg-white/50 p-3 rounded-lg text-center shadow-sm">
                    <Droplet className="h-6 w-6 text-[#227d7f] mx-auto mb-1" />
                    <p className="font-medium text-[#414042]">{comparisons.water.bathtubs}</p>
                    <p className="text-xs">full bathtubs of water</p>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-lg text-center shadow-sm">
                    <CloudRain className="h-6 w-6 text-[#227d7f] mx-auto mb-1" />
                    <p className="font-medium text-[#414042]">{comparisons.water.showers}</p>
                    <p className="text-xs">8-minute showers</p>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-lg text-center shadow-sm">
                    <div className="relative mx-auto mb-1 h-6 w-6">
                      <Droplet className="h-6 w-6 text-[#227d7f] absolute" />
                      <Droplet className="h-4 w-4 text-[#227d7f]/70 absolute top-2 left-2" />
                    </div>
                    <p className="font-medium text-[#414042]">{comparisons.water.swimmingPools}</p>
                    <p className="text-xs">Olympic-sized swimming pools</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Landfill section removed as requested */}
        </AnimatePresence>
        
        {/* Call to action */}
        <motion.div 
          className="bg-[#f0f9f4] p-4 rounded-lg border border-[#0c4428]/10 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-center text-[#0c4428] font-medium">
            Fighting hunger and climate change together
          </p>
        </motion.div>
      </div>
    </SlideLayout>
  );
}
