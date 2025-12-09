export interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: "Available" | "Sold" | "Pending";
  highlight: string;
  image?: string;
}

export interface SearchResponse {
  properties: Property[];
  recommendation: string;
}
