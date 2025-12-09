import { useState, useRef, useEffect } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
  "3 bedroom apartments under 3 million in Addis",
  "Houses in Bole with garden",
  "Available apartments in Bahir Dar",
  "Luxury villas in CMC",
  "Studio apartments near Megenagna",
  "Commercial space in Kazanchis",
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.length > 0 ? filtered : suggestions);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-3xl mx-auto relative"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative glass-strong rounded-2xl overflow-hidden shadow-medium">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Try: '3 bedroom apartments under 3 million in Addis'"
            className="w-full h-16 pl-14 pr-36 bg-transparent text-foreground placeholder:text-muted-foreground text-lg focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Button
              type="submit"
              variant="hero"
              size="lg"
              disabled={isLoading || !query.trim()}
              className="rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden shadow-medium z-50"
          >
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-3 py-2 font-medium uppercase tracking-wide">
                Suggestions
              </p>
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-foreground hover:bg-primary/10 transition-colors flex items-center gap-3"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
