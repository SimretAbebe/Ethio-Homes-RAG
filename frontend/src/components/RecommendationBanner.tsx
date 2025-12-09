import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";

interface RecommendationBannerProps {
  property: Property;
  recommendation: string;
  onViewDetails: () => void;
}

export function RecommendationBanner({
  property,
  recommendation,
  onViewDetails,
}: RecommendationBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent opacity-95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMHY2aDZ2LTZoLTZ6bTEwIDEwdjZoNnYtNmgtNnptMC0xMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-primary-foreground fill-current" />
              <span className="text-primary-foreground/90 font-semibold text-sm uppercase tracking-wider">
                Top Recommendation
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              {property.title}
            </h3>
            <p className="text-primary-foreground/85 text-base md:text-lg max-w-xl">
              {recommendation}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Button
              onClick={onViewDetails}
              variant="glass"
              size="xl"
              className="bg-primary-foreground/15 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/25 group"
            >
              View Details
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
