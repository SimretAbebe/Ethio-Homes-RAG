import type { Property, SearchResponse } from "@/types/property";

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Apartment in Bole",
    type: "apartment",
    location: "Bole, Addis Ababa",
    price: 2800000,
    bedrooms: 3,
    bathrooms: 2,
    status: "Available",
    highlight: "Stunning city views with modern finishes and 24/7 security. Walking distance to Bole Airport.",
  },
  {
    id: "2",
    title: "Luxury Villa in CMC",
    type: "villa",
    location: "CMC, Addis Ababa",
    price: 8500000,
    bedrooms: 5,
    bathrooms: 4,
    status: "Available",
    highlight: "Spacious garden, private parking, and premium amenities in a gated community.",
  },
  {
    id: "3",
    title: "Cozy Studio near Megenagna",
    type: "studio",
    location: "Megenagna, Addis Ababa",
    price: 950000,
    bedrooms: 1,
    bathrooms: 1,
    status: "Pending",
    highlight: "Perfect for young professionals. Close to public transport and shopping centers.",
  },
  {
    id: "4",
    title: "Family House in Bahir Dar",
    type: "house",
    location: "Kebele 14, Bahir Dar",
    price: 4200000,
    bedrooms: 4,
    bathrooms: 3,
    status: "Available",
    highlight: "Near Lake Tana with beautiful lake views. Traditional Ethiopian architecture with modern amenities.",
  },
  {
    id: "5",
    title: "Executive Condo in Kazanchis",
    type: "condo",
    location: "Kazanchis, Addis Ababa",
    price: 5600000,
    bedrooms: 3,
    bathrooms: 2,
    status: "Sold",
    highlight: "Prime business district location with high-end finishes and concierge services.",
  },
];

export function searchProperties(query: string): SearchResponse {
  const lowerQuery = query.toLowerCase();
  
  // Simple filtering based on query keywords
  let filtered = mockProperties.filter((property) => {
    const searchText = `${property.title} ${property.location} ${property.type} ${property.highlight}`.toLowerCase();
    return searchText.includes(lowerQuery) || 
           lowerQuery.includes(property.location.toLowerCase().split(",")[0]) ||
           lowerQuery.includes(property.type);
  });

  // Filter by price if mentioned
  const priceMatch = query.match(/under (\d+)\s*(million|m)/i);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1]) * 1000000;
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // Filter by bedrooms if mentioned
  const bedroomMatch = query.match(/(\d+)\s*bedroom/i);
  if (bedroomMatch) {
    const bedrooms = parseInt(bedroomMatch[1]);
    filtered = filtered.filter((p) => p.bedrooms >= bedrooms);
  }

  // Filter by status
  if (lowerQuery.includes("available")) {
    filtered = filtered.filter((p) => p.status === "Available");
  }

  // If no results, return some defaults
  if (filtered.length === 0) {
    filtered = mockProperties.slice(0, 3);
  }

  // Limit to 5 results
  filtered = filtered.slice(0, 5);

  // Generate recommendation
  const topPick = filtered[0];
  const recommendation = topPick
    ? `Based on your search, we highly recommend the ${topPick.title}. ${topPick.highlight}`
    : "Check out our featured properties below.";

  return {
    properties: filtered,
    recommendation,
  };
}
