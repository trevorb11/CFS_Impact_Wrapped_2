import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SLIDE_COLORS } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SlideLayoutProps {
  children: ReactNode;
  title: string;
  variant: keyof typeof SLIDE_COLORS;
  subtitle?: string;
  quote?: string;
  titleClassName?: string; 
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstSlide?: boolean;
  isLastSlide?: boolean;
  useFullPage?: boolean; // New prop for full-page layout on desktop
}

// Updated color palette to use brand colors
const BRAND_COLORS = {
  COMMUNITY_ROOTS: "#BAD9A3",
  MOBILE_PANTRY: "#F08445"
};

export default function SlideLayout({
  children,
  title,
  variant,
  subtitle,
  quote,
  titleClassName = "",
  onNext,
  onPrevious,
  isFirstSlide = false,
  isLastSlide = false,
  useFullPage = false
}: SlideLayoutProps) {
  const bgColor = SLIDE_COLORS[variant];
  const headerBgColor = variant === 'meals' ? 'bg-[#227d7f]' : 
                        variant === 'donor' || variant === 'donorSummary' ? 'bg-[#0c4428]' : 
                        variant === 'people' || variant === 'summary' ? 'bg-[#0c4428]' : 
                        variant === 'environment' ? 'bg-[#f97316]' : 
                        variant === 'foodRescue' ? 'bg-[#efeb03]' : 
                        variant === 'nutrition' ? 'bg-[#227d7f]' : 
                        variant === 'volunteer' ? 'bg-[#0c4428]' : 'bg-[#0c4428]';

  // Get gradient backgrounds using CFS brand colors
  const getFullPageBg = () => {
    switch (variant) {
      case 'meals':
        return 'bg-gradient-to-br from-[#227d7f] via-[#00d6dd] to-[#0c4428]'; // Teal to Light Blue to Dark Green
      case 'people':
        return 'bg-gradient-to-br from-[#0c4428] via-[#8dc53e] to-[#227d7f]'; // Dark Green to Bright Green to Teal
      case 'environment':
        return 'bg-gradient-to-br from-[#8dc53e] via-[#227d7f] to-[#00d6dd]'; // Bright Green to Teal to Light Blue
      case 'donor':
      case 'donorSummary':
        return 'bg-gradient-to-br from-[#0c4428] via-[#227d7f] to-[#8dc53e]'; // Dark Green to Teal to Bright Green
      case 'foodRescue':
        return 'bg-gradient-to-br from-[#efeb03] via-[#8dc53e] to-[#227d7f]'; // Yellow to Bright Green to Teal
      case 'nutrition':
        return 'bg-gradient-to-br from-[#227d7f] via-[#0c4428] to-[#8dc53e]'; // Teal to Dark Green to Bright Green
      case 'volunteer':
        return 'bg-gradient-to-br from-[#0c4428] via-[#8dc53e] to-[#00d6dd]'; // Dark Green to Bright Green to Light Blue
      case 'summary':
        return 'bg-gradient-to-br from-[#0c4428] via-[#227d7f] to-[#8dc53e]'; // Dark Green to Teal to Bright Green
      default:
        return 'bg-gradient-to-br from-[#0c4428] via-[#227d7f] to-[#00d6dd]'; // Dark Green to Teal to Light Blue
    }
  };

  // Full-page layout for desktop, card layout for mobile
  if (useFullPage) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden ${getFullPageBg()}`}>
        {/* Floating background circles similar to intro slides */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 120 - 10}%`,
                top: `${Math.random() * 120 - 10}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-15, 15, -15],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Mobile: Card layout, Desktop: Full-page layout */}
        <div className="w-full h-full flex flex-col items-center justify-between relative z-10 py-4 md:py-12 lg:py-16">
          {/* Mobile card layout (hidden on desktop) */}
          <div className="md:hidden w-full max-w-md mx-4 flex flex-col min-h-0 flex-1">
            <Card className="w-full overflow-hidden flex flex-col flex-1">
              <CardHeader className={`text-center ${headerBgColor} text-white rounded-t-lg py-4 flex-shrink-0`}>
                <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
                {subtitle && (
                  <CardDescription className="text-white opacity-90">{subtitle}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4 px-4 flex-1 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-full flex-1"
                >
                  {children}
                </motion.div>
                
                {/* Mobile navigation inside card */}
                <div className="flex justify-between pt-4 mt-auto flex-shrink-0">
                  {!isFirstSlide && onPrevious ? (
                    <Button 
                      variant="outline" 
                      onClick={onPrevious} 
                      className="text-sm px-4 py-2"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>
                  ) : (
                    <div />
                  )}
                  {!isLastSlide && onNext && (
                    <Button 
                      variant="default" 
                      onClick={onNext} 
                      className="text-sm px-4 py-2"
                    >
                      Next <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop full-page layout (hidden on mobile) */}
          <div className="hidden md:flex flex-col items-center justify-center w-full flex-1 text-center px-8">
            <motion.h1
              className={`text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 ${titleClassName}`}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3
              }}
            >
              {title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full max-w-4xl"
            >
              {children}
            </motion.div>

            {quote && (
              <motion.div
                className="mt-12 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <p className="text-white/90 text-lg lg:text-xl italic font-medium">
                  "{quote}"
                </p>
              </motion.div>
            )}
          </div>

          {/* Navigation buttons for desktop full-page */}
          <div className="hidden md:flex justify-between w-full max-w-4xl px-8">
            {!isFirstSlide && onPrevious && (
              <Button 
                variant="outline" 
                onClick={onPrevious} 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white px-6 py-2 text-base"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            <div className="flex-1" />
            {!isLastSlide && onNext && (
              <Button 
                variant="outline" 
                onClick={onNext} 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white px-6 py-2 text-base"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>


      </div>
    );
  }

  // Fallback to original card layout
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#8dc53e]/10 to-[#0c4428]/20 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        <Card className="w-full overflow-hidden">
          <CardHeader className={`text-center ${headerBgColor} text-white rounded-t-lg py-4 md:py-6`}>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">{title}</CardTitle>
            {subtitle && (
              <CardDescription className="text-white opacity-90">{subtitle}</CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="pt-6 sm:pt-8 md:pt-10 space-y-5 sm:space-y-6 md:space-y-8 px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full"
            >
              {children}
            </motion.div>
            
            {quote && (
              <motion.div
                className="bg-[#BAD9A3]/20 p-4 md:p-6 rounded-lg border-l-4 border-[#BAD9A3]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <p className="text-[#414042] text-sm md:text-base italic font-medium">
                  "{quote}"
                </p>
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
            <div className="flex justify-between w-full mt-4">
              {!isFirstSlide && onPrevious && (
                <Button variant="outline" onClick={onPrevious} className="border-[#227d7f] text-[#227d7f] hover:bg-[#227d7f] hover:text-white md:px-6 md:py-2 md:text-base">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}
              {!isFirstSlide && isLastSlide && (
                <div />
              )}
              {!isLastSlide && onNext && (
                <Button variant="outline" onClick={onNext} className="ml-auto border-[#227d7f] text-[#227d7f] hover:bg-[#227d7f] hover:text-white md:px-6 md:py-2 md:text-base">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="mt-4 md:mt-6 text-center">
        <p className="text-[#0c4428] text-xs md:text-sm">
          © Community Food Share {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
