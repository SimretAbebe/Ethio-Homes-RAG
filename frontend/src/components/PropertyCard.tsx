import { Bed, Bath, MapPin, Home, Building2, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  index: number;
  onClick: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "house":
      return <Home className="h-5 w-5" />;
    case "apartment":
      return <Building2 className="h-5 w-5" />;
    case "villa":
      return <Crown className="h-5 w-5" />;
    default:
      return <Home className="h-5 w-5" />;
  }
};

const formatPrice = (price: number) => {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)}M ETB`;
  }
  return new Intl.NumberFormat().format(price) + " ETB";
};

export function PropertyCard({ property, index, onClick }: PropertyCardProps) {
  const isAvailable = property.status === "Available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className={`h-full cursor-pointer overflow-hidden transition-all duration-300 
          ${
            isAvailable
              ? "border-primary/30 shadow-lg hover:shadow-2xl hover:border-primary/60"
              : "border-border/40 opacity-90"
          } 
          bg-card/95 backdrop-blur-sm hover:bg-card`}
      >
        <CardContent className="p-6 space-y-5">
          {/* Header: ID + Type + Status */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  isAvailable ? "bg-primary/10" : "bg-muted"
                }`}
              >
                {getTypeIcon(property.type)}
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground">
                  Property #{property.id}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {property.type} • {property.location}
                </p>
              </div>
            </div>
            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className="font-semibold"
            >
              {isAvailable ? "Available" : "Sold"}
            </Badge>
          </div>

          {/* Price — Big & Bold */}
          <div className="text-center py-4">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatPrice(property.price)}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              <span className="font-semibold text-foreground">
                {property.bedrooms} Bedroom{property.bedrooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              <span className="font-semibold text-foreground">
                {property.bathrooms} Bathroom{property.bathrooms > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Highlight / Description */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm leading-relaxed text-foreground/90 italic text-center">
              "
              {property.title ||
                property.description ||
                "A beautiful home waiting for you"}
              "
            </p>
          </div>

          {/* Location Footer */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-3">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
