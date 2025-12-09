import {
  X,
  Bed,
  Bath,
  MapPin,
  Home,
  Building2,
  Crown,
  Sparkles,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { Property } from "@/types/property";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "house":
      return <Home className="h-7 w-7" />;
    case "apartment":
      return <Building2 className="h-7 w-7" />;
    case "villa":
      return <Crown className="h-7 w-7" />;
    default:
      return <Home className="h-7 w-7" />;
  }
};

const formatPrice = (price: number) => {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} Million ETB`;
  }
  return new Intl.NumberFormat("en-ET").format(price) + " ETB";
};

export function PropertyModal({
  property,
  isOpen,
  onClose,
}: PropertyModalProps) {
  if (!property) return null;

  const isAvailable = property.status === "Available";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                       md:max-w-2xl md:max-h-[90vh] bg-card rounded-3xl shadow-2xl overflow-hidden z-50"
          >
            <div className="relative h-full overflow-y-auto">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 rounded-full bg-card/80 hover:bg-card"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Hero Header with Gradient */}
              <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-card p-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  {getTypeIcon(property.type)}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
                  Property #{property.id}
                </h2>
                <p className="text-xl text-muted-foreground capitalize">
                  {property.type} in {property.location}
                </p>
              </div>

              <div className="p-8 space-y-8">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge
                    variant={isAvailable ? "default" : "secondary"}
                    className="text-lg px-6 py-2 font-bold"
                  >
                    {isAvailable ? "Available Now" : "Sold"}
                  </Badge>
                </div>

                {/* Price — Big & Bold */}
                <div className="text-center py-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
                  <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(property.price)}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <Bed className="h-10 w-10 mx-auto text-primary" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                  </div>
                  <div className="space-y-2">
                    <Bath className="h-10 w-10 mx-auto text-primary" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                  </div>
                  <div className="space-y-2">
                    <MapPin className="h-10 w-10 mx-auto text-primary" />
                    <p className="text-lg font-bold">{property.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>

                {/* Highlight Quote */}
                <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                  <Sparkles className="h-8 w-8 text-primary mb-4 mx-auto" />
                  <p className="text-xl md:text-2xl font-medium text-center text-foreground italic leading-relaxed">
                    "
                    {property.title ||
                      property.description ||
                      "A perfect home waiting for you in Ethiopia"}
                    "
                  </p>
                </div>

                {/* Call to Action */}
                <div className="pt-6">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg"
                    variant={isAvailable ? "default" : "secondary"}
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    {isAvailable ? "Contact Agent Now" : "Property Sold"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
