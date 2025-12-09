import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Building2, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { RecommendationBanner } from "@/components/RecommendationBanner";
import { PropertyModal } from "@/components/PropertyModal";
import { NoResults } from "@/components/NoResults";
import { searchProperties } from "@/lib/api"; 
import type { Property, SearchResponse } from "@/types/property";
import heroImage from "@/assets/hero-addis-ababa.jpg";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 130,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0d9488", "#06b6d4", "#14b8a6", "#2dd4bf", "#a78bfa"],
    });
  };

  
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchQuery(query);
    setSearchResults(null);

    try {
      const result = await searchProperties(query);

      setSearchResults({
        properties: result.properties,
        recommendation:
          result.recommendation || "Here are the best matches for you!",
      });

      if (result.properties.length > 0) {
        triggerConfetti();
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults({
        properties: [],
        recommendation:
          "Sorry, the AI is not responding. Is the backend running on port 8000?",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleReset = () => {
    setSearchResults(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-strong">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">
              EthioHomes
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/30 backdrop-blur-md text-white px-4 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium drop-shadow-md">
                AI-Powered Property Search
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl [text-shadow:_0_4px_20px_rgba(0,0,0,0.5)]">
              Find Your Dream Home in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent">
                Ethiopia
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto mb-10 drop-shadow-lg [text-shadow:_0_2px_10px_rgba(0,0,0,0.4)]">
              Search real estate in Addis Ababa and Bahir Dar using natural
              language.
            </p>
          </motion.div>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {searchResults && (
          <motion.section
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-16"
          >
            {searchResults.properties.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                    Real Estate Found
                  </h2>
                  <p className="text-muted-foreground">
                    Showing {searchResults.properties.length} results for "
                    {searchQuery}"
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                  {searchResults.properties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      onClick={() => handlePropertyClick(property)}
                    />
                  ))}
                </div>

                <RecommendationBanner
                  property={searchResults.properties[0]}
                  recommendation={searchResults.recommendation}
                  onViewDetails={() =>
                    handlePropertyClick(searchResults.properties[0])
                  }
                />
              </>
            ) : (
              <NoResults query={searchQuery} onReset={handleReset} />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Powered by AI RAG
          </p>
        </div>
      </footer>

      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;
