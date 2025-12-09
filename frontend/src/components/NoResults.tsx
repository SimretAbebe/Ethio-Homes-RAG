import { motion } from "framer-motion";
import { SearchX, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
  query: string;
  onReset: () => void;
}

export function NoResults({ query, onReset }: NoResultsProps) {
  const suggestions = [
    "Try broader search terms",
    "Check spelling of location names",
    "Adjust your price range",
    "Search by property type only",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-4"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-3">
        No properties found
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find any properties matching "{query}". Here are some tips:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-8">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-2"
          >
            <Home className="h-4 w-4 text-primary" />
            {suggestion}
          </motion.div>
        ))}
      </div>

      <Button onClick={onReset} variant="default" size="lg">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try a new search
      </Button>
    </motion.div>
  );
}
